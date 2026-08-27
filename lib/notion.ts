import type {
  ActivitiesPayload,
  ActivityRecord,
  ActivityStatus,
  CategoryRecord,
  PartnerRecord,
  TicketRecord,
} from './types'
import { resolveActivityState } from './activityStatus'
import { unstable_cache } from 'next/cache'

const NOTION_VERSION = '2022-06-28'
const NOTION_REQUEST_TIMEOUT_MS = 15_000
const NOTION_ACTIVITY_CACHE_REVALIDATE_SECONDS = 600
const NOTION_ACTIVITY_CACHE_TAG = 'activities'

const LOCAL_POSTER_OVERRIDES: Record<string, string> = {
  '3b8b89c0-25b0-816f-9bcc-e5fa373fff75': '/images/upcoming-test-poster.png',
}

export interface NotionPage {
  id: string
  last_edited_time?: string
  properties: Record<string, unknown>
}

export interface NotionActivitySnapshot {
  rows: NotionPage[]
  syncedAt: string
}

export interface NotionActivityRefreshResult {
  status: 'success' | 'failed'
  records: number | null
  syncedAt: string | null
  error?: {
    code: string
    status: number | null
    message: string
  }
}

export class NotionApiError extends Error {
  readonly code: string
  readonly status: number | null

  constructor(message: string, code: string, status: number | null = null) {
    super(message)
    this.name = 'NotionApiError'
    this.code = code
    this.status = status
  }
}

interface NotionProp {
  title?: Array<{ plain_text?: string }>
  rich_text?: Array<{ plain_text?: string }>
  select?: { name?: string } | null
  status?: { name?: string } | null
  url?: string | null
  number?: number | null
  checkbox?: boolean
  date?: { start?: string | null; end?: string | null } | null
  files?: Array<{
    file?: { url?: string } | null
    external?: { url?: string } | null
  }>
}

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_ACTIVITY_DB_ID)
}

export function hasNotionActivityDatabase(): boolean {
  return Boolean(process.env.NOTION_ACTIVITY_DB_ID)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function isNotionPageShape(value: unknown): value is NotionPage {
  if (!isRecord(value) || typeof value.id !== 'string' || !isRecord(value.properties)) {
    return false
  }
  if (value.last_edited_time !== undefined && typeof value.last_edited_time !== 'string') {
    return false
  }
  return Object.values(value.properties).every((property) => isRecord(property))
}

function normalizeNotionError(error: unknown): NotionApiError {
  if (error instanceof NotionApiError) return error

  const message = error instanceof Error ? error.message : String(error)
  const name = error instanceof Error ? error.name : ''
  if (name === 'TimeoutError' || name === 'AbortError') {
    return new NotionApiError(
      `Notion request timed out after ${NOTION_REQUEST_TIMEOUT_MS}ms`,
      'timeout',
    )
  }

  return new NotionApiError(message || 'Notion request failed', 'network-error')
}

function logNotionSyncFailure(error: NotionApiError) {
  console.error(JSON.stringify({
    scope: 'notion-activities',
    event: 'sync-failed',
    code: error.code,
    status: error.status,
    message: error.message.slice(0, 300),
  }))
}

async function queryActivityPages(databaseId: string): Promise<NotionPage[]> {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) {
    throw new NotionApiError('NOTION_API_KEY is not configured', 'not-configured')
  }

  const rows: NotionPage[] = []
  const seenCursors = new Set<string>()
  let cursor: string | undefined

  do {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
        signal: AbortSignal.timeout(NOTION_REQUEST_TIMEOUT_MS),
      },
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new NotionApiError(
        `Notion query failed (${response.status}): ${detail.slice(0, 300)}`,
        'http-error',
        response.status,
      )
    }

    let body: unknown
    try {
      body = await response.json()
    } catch {
      throw new NotionApiError('Notion returned invalid JSON', 'invalid-response')
    }

    if (!isRecord(body) || !Array.isArray(body.results)) {
      throw new NotionApiError('Notion response is missing results', 'invalid-response')
    }

    for (const row of body.results) {
      if (!isNotionPageShape(row)) {
        throw new NotionApiError('Notion response contains an invalid activity page', 'invalid-response')
      }
      rows.push(row)
    }

    if (typeof body.has_more !== 'boolean') {
      throw new NotionApiError('Notion response has an invalid pagination flag', 'invalid-response')
    }

    const hasMore = body.has_more
    if (
      body.next_cursor !== undefined &&
      body.next_cursor !== null &&
      typeof body.next_cursor !== 'string'
    ) {
      throw new NotionApiError('Notion response has an invalid pagination cursor', 'invalid-response')
    }
    const nextCursor = typeof body.next_cursor === 'string' ? body.next_cursor : undefined
    if (!hasMore) {
      if (nextCursor) {
        throw new NotionApiError('Notion response has an unexpected pagination cursor', 'invalid-response')
      }
      cursor = undefined
      continue
    }
    if (!nextCursor || seenCursors.has(nextCursor)) {
      throw new NotionApiError('Notion pagination returned an invalid cursor', 'invalid-response')
    }
    seenCursors.add(nextCursor)
    cursor = nextCursor
  } while (cursor)

  return rows
}

async function fetchNotionActivitySnapshot(databaseId: string): Promise<NotionActivitySnapshot> {
  const startedAt = Date.now()
  try {
    const rows = await queryActivityPages(databaseId)
    const syncedAt = new Date().toISOString()
    console.info(JSON.stringify({
      scope: 'notion-activities',
      event: 'sync-succeeded',
      records: rows.length,
      syncedAt,
      durationMs: Date.now() - startedAt,
    }))
    return { rows, syncedAt }
  } catch (error) {
    const normalized = normalizeNotionError(error)
    logNotionSyncFailure(normalized)
    throw normalized
  }
}

// `unstable_cache` keeps the last value available when a background
// revalidation throws; that stale-on-error behavior is required for the
// activity snapshot and is not guaranteed by a plain uncached fetch.
const getCachedNotionActivitySnapshot = unstable_cache(
  async (databaseId: string) => fetchNotionActivitySnapshot(databaseId),
  ['rainier-notion-activity-snapshot'],
  {
    revalidate: NOTION_ACTIVITY_CACHE_REVALIDATE_SECONDS,
    tags: [NOTION_ACTIVITY_CACHE_TAG],
  },
)

export async function getNotionActivitySnapshot(): Promise<NotionActivitySnapshot> {
  const databaseId = process.env.NOTION_ACTIVITY_DB_ID
  if (!databaseId) {
    throw new NotionApiError('NOTION_ACTIVITY_DB_ID is not configured', 'not-configured')
  }
  return getCachedNotionActivitySnapshot(databaseId)
}

/**
 * Reads the last successful Notion snapshot and normalizes it for the current
 * time. The cached value is raw Notion data, so a page revalidation recalculates
 * activity states from the current clock even when the upstream is temporarily
 * stale.
 */
export async function fetchActivitiesFromNotion(): Promise<ActivitiesPayload | null> {
  if (!hasNotionActivityDatabase()) return null

  try {
    const snapshot = await getNotionActivitySnapshot()
    return {
      ...normalizeNotionActivities(snapshot.rows, new Date()),
      source: 'notion',
      syncedAt: snapshot.syncedAt,
    }
  } catch {
    // unstable_cache keeps serving its last successful value when a stale
    // revalidation fails. This branch is only reached when no usable snapshot
    // exists yet, so the caller may use the static bootstrap data.
    return null
  }
}

export async function refreshNotionActivityCache(): Promise<NotionActivityRefreshResult> {
  if (!hasNotionActivityDatabase()) {
    const error = new NotionApiError('Notion is not configured', 'not-configured')
    logNotionSyncFailure(error)
    return {
      status: 'failed',
      records: null,
      syncedAt: null,
      error: { code: error.code, status: error.status, message: error.message },
    }
  }

  try {
    const snapshot = await getNotionActivitySnapshot()
    return {
      status: 'success',
      records: snapshot.rows.length,
      syncedAt: snapshot.syncedAt,
    }
  } catch (error) {
    const normalized = normalizeNotionError(error)
    return {
      status: 'failed',
      records: null,
      syncedAt: null,
      error: {
        code: normalized.code,
        status: normalized.status,
        message: normalized.message,
      },
    }
  }
}

function getProp(page: NotionPage, names: string[]): NotionProp | undefined {
  for (const name of names) {
    const p = page.properties?.[name]
    if (p && typeof p === 'object') return p as NotionProp
  }
  return undefined
}

function textValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  const parts = Array.isArray(p?.title) ? p.title : Array.isArray(p?.rich_text) ? p.rich_text : []
  return parts
    .map((t) => t?.plain_text ?? '')
    .join('')
    .trim()
}

function selectValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  const select = p?.select?.name ?? p?.status?.name
  return typeof select === 'string' ? select : ''
}

function urlValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  if (typeof p?.url === 'string' && p.url) return p.url
  const file = p?.files?.[0]
  return file?.file?.url ?? file?.external?.url ?? ''
}

function urlPropertyValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  return typeof p?.url === 'string' && p.url ? p.url : ''
}

function numberValue(page: NotionPage, names: string[]): number | null {
  const value = getProp(page, names)?.number
  return typeof value === 'number' ? value : null
}

function checkboxValue(page: NotionPage, names: string[]): boolean {
  return Boolean(getProp(page, names)?.checkbox)
}

function dateValue(page: NotionPage, names: string[]): {
  date: string | null
  time: string | null
  rawStart: string | null
  rawEnd: string | null
} {
  const startValue = getProp(page, names)?.date?.start
  const endValue = getProp(page, names)?.date?.end
  const start = typeof startValue === 'string' ? startValue : null
  const end = typeof endValue === 'string' ? endValue : null
  if (!start) return { date: null, time: null, rawStart: null, rawEnd: end }
  const [datePart, timePart] = start.split('T')
  return {
    date: datePart || null,
    time: timePart ? timePart.slice(0, 5) : null,
    rawStart: start,
    rawEnd: end,
  }
}

interface CategoryMeta {
  id: string
  name: string
  nameEn: string
  tagline: string
  taglineEn: string
  color: string
}

const CATEGORY_ALIASES: Record<string, string> = {
  读书会: 'reading',
  书目共读: 'reading',
  主题共读: 'reading',
  reading: 'reading',
  'book club': 'reading',
  雨山前talk: 'talk',
  talk: 'talk',
  'ysq talk': 'talk',
  嘉宾分享: 'talk',
  三小时线上阅读: 'online-reading',
  线上阅读: 'online-reading',
  'online reading': 'online-reading',
  online: 'online-reading',
  写作营: 'writing',
  写作工坊: 'writing',
  诗歌工坊: 'writing',
  writing: 'writing',
  剧本围读: 'drama',
  drama: 'drama',
  亲子共读: 'family',
  family: 'family',
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  reading: {
    id: 'reading',
    name: '读书会',
    nameEn: 'Weekly Reading',
    tagline: '重建社群，以书为桥',
    taglineEn: 'Rebuilding community through literature',
    color: '#2E463D',
  },
  talk: {
    id: 'talk',
    name: '雨山前Talk',
    nameEn: 'YSQ Talk',
    tagline: '与思想者对话',
    taglineEn: 'Conversations with thinkers',
    color: '#3D4E5C',
  },
  'online-reading': {
    id: 'online-reading',
    name: '三小时线上阅读',
    nameEn: '3-Hour Reading Session',
    tagline: '同频共振，安静读书',
    taglineEn: 'Read together, in silence',
    color: '#5C6E5E',
  },
  writing: {
    id: 'writing',
    name: '雨山前写作营',
    nameEn: 'Writing Camp',
    tagline: '写出你自己的故事',
    taglineEn: 'Write your own story',
    color: '#4A3728',
  },
  drama: {
    id: 'drama',
    name: '剧本围读',
    nameEn: 'Script Reading',
    tagline: '在角色里遇见另一种人生',
    taglineEn: 'Live another life through roles',
    color: '#6B4F3A',
  },
  family: {
    id: 'family',
    name: '亲子共读',
    nameEn: 'Family Reading',
    tagline: '和下一代一起读书',
    taglineEn: 'Read together with the next generation',
    color: '#7A6B4F',
  },
}

function resolveCategory(raw: string): CategoryMeta {
  const key = CATEGORY_ALIASES[raw.trim().toLowerCase()] ?? raw.trim().toLowerCase().replace(/\s+/g, '-')
  const known = CATEGORY_META[key]
  if (known) return known
  return {
    id: key || 'uncategorized',
    name: raw || '未分类',
    nameEn: '',
    tagline: '',
    taglineEn: '',
    color: '#5C6E5E',
  }
}

function sortActivities(list: ActivityRecord[]): ActivityRecord[] {
  return [...list].sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      String(a.date ?? '').localeCompare(String(b.date ?? '')),
  )
}

export function normalizeNotionActivities(rows: NotionPage[], now = new Date()): ActivitiesPayload {
  const categoryMap = new Map<string, CategoryRecord>()
  const upcoming: ActivityRecord[] = []
  const partners: PartnerRecord[] = []
  const tickets: TicketRecord[] = []

  for (const row of rows) {
    const isPartner = checkboxValue(row, ['是否友社活动', '友社活动', 'Partner Event'])
    const categoryMeta = resolveCategory(selectValue(row, ['分类', 'Category', '类目']))
    const rawStatus = selectValue(row, ['状态', 'Status'])
    const { date, time, rawStart, rawEnd } = dateValue(row, ['开始时间', '日期', 'Date'])
    const separateEnd = dateValue(row, ['结束时间', 'End Time', '结束日期']).rawStart
    const endAt = separateEnd ?? rawEnd
    const resolvedState = resolveActivityState({ rawStatus, startDate: rawStart ?? date, endAt, now })
    if (resolvedState === 'hidden') continue
    const status: ActivityStatus = resolvedState
    const title = textValue(row, ['活动名称', '名称', 'Name', 'Title']) || '未命名活动'
    const description = textValue(row, ['简介', '描述', 'Description'])
    const poster = LOCAL_POSTER_OVERRIDES[row.id]
      ?? urlPropertyValue(row, ['海报图片 URL', 'Poster URL'])
    const registerUrl = urlValue(row, ['报名链接（Eventbrite）', '报名链接', 'Register URL', '报名'])
    const reviewUrl = urlValue(row, ['回顾文章链接', 'Review URL', '回顾链接'])
    const generalPrice = numberValue(row, ['普通票价', 'General Price', '普通票'])
    const supporterPrice = numberValue(row, ['支持者票价', 'Supporter Price', '支持者票'])
    const supporterPerks = textValue(row, ['支持者票含周边说明', 'Supporter Perks', '支持者票权益'])

    const activity: ActivityRecord = {
      id: row.id,
      title,
      titleEn: textValue(row, ['活动名称（英文）', '英文名称', 'English Name']) || null,
      subType: selectValue(row, ['活动类型', 'Sub Type', '子分类']) || null,
      date,
      time,
      endAt,
      location: textValue(row, ['地点', 'Location']) || null,
      locationDetail: textValue(row, ['地点详情', 'Location Detail']) || null,
      description: description || null,
      descriptionEn: textValue(row, ['英文简介', 'English Description']) || null,
      poster: poster || null,
      registerUrl: registerUrl || null,
      reviewUrl: reviewUrl || null,
      comingSoon: status === 'coming_soon',
      featured: checkboxValue(row, ['是否置顶', 'Featured', '置顶']),
      status,
    }

    if (isPartner) {
      // Expired partner events disappear from the public site instead of
      // entering Rainier Literature Society's archive.
      if (status === 'past') continue

      partners.push({
        id: row.id,
        partnerName: textValue(row, ['友社名称', 'Partner Name', '友社']) || '友社',
        partnerNameEn: textValue(row, ['友社名称（英文）', 'Partner Name (English)']) || null,
        eventName: title,
        eventNameEn: activity.titleEn,
        date,
        time,
        endAt,
        location: activity.location,
        locationDetail: activity.locationDetail,
        description: description || null,
        descriptionEn: activity.descriptionEn,
        poster: activity.poster,
        url: urlValue(row, ['友社链接', 'Partner URL']) || registerUrl || '#',
        comingSoon: activity.comingSoon,
        status,
      })
      continue
    }

    let category = categoryMap.get(categoryMeta.id)
    if (!category) {
      category = {
        ...categoryMeta,
        textColor: '#ffffff',
        comingSoon: false,
        events: [],
      }
      categoryMap.set(categoryMeta.id, category)
    }
    category.events.push(activity)

    if (status === 'upcoming' || status === 'coming_soon') {
      upcoming.push(activity)
    }

    if (status !== 'past' && (generalPrice != null || supporterPrice != null || registerUrl)) {
      tickets.push({
        id: `t-${row.id}`,
        activityId: row.id,
        title,
        date,
        time,
        location: activity.location,
        generalPrice,
        generalUrl: registerUrl || '#',
        supporterPrice,
        supporterUrl: registerUrl || '#',
        supporterPerks: supporterPerks || null,
        comingSoon: status === 'coming_soon',
      })
    }
  }

  const categories: CategoryRecord[] = [...categoryMap.values()].map((c) => ({
    ...c,
    comingSoon: c.events.length > 0 && c.events.every((e) => e.comingSoon),
    events: sortActivities(c.events),
  }))

  return {
    upcoming: sortActivities(upcoming),
    categories,
    partners,
    tickets,
  }
}
