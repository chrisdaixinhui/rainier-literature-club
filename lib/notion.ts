import type {
  ActivitiesPayload,
  ActivityRecord,
  ActivityStatus,
  CategoryRecord,
  PartnerRecord,
  TicketRecord,
} from './types'

const NOTION_VERSION = '2022-06-28'

interface NotionPage {
  id: string
  properties: Record<string, unknown>
}

interface NotionProp {
  title?: Array<{ plain_text?: string }>
  rich_text?: Array<{ plain_text?: string }>
  select?: { name?: string } | null
  status?: { name?: string } | null
  url?: string | null
  number?: number | null
  checkbox?: boolean
  date?: { start?: string | null } | null
  files?: Array<{
    file?: { url?: string } | null
    external?: { url?: string } | null
  }>
}

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_ACTIVITY_DB_ID)
}

/**
 * Fetches the activity database from Notion and normalizes it into the same
 * shape as `data/activities.json`. Returns `null` when Notion is not configured
 * or the request fails, so callers can fall back to the static JSON data.
 */
export async function fetchActivitiesFromNotion(): Promise<ActivitiesPayload | null> {
  if (!isNotionConfigured()) return null

  const apiKey = process.env.NOTION_API_KEY!
  const databaseId = process.env.NOTION_ACTIVITY_DB_ID!

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page_size: 100 }),
      },
    )
    if (!res.ok) return null
    const body = (await res.json()) as { results: NotionPage[] }
    return normalizeNotionActivities(body.results ?? [])
  } catch {
    return null
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
  const parts = p?.title ?? p?.rich_text ?? []
  return parts
    .map((t) => t?.plain_text ?? '')
    .join('')
    .trim()
}

function selectValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  return p?.select?.name ?? p?.status?.name ?? ''
}

function urlValue(page: NotionPage, names: string[]): string {
  const p = getProp(page, names)
  if (typeof p?.url === 'string' && p.url) return p.url
  const file = p?.files?.[0]
  return file?.file?.url ?? file?.external?.url ?? ''
}

function numberValue(page: NotionPage, names: string[]): number | null {
  const value = getProp(page, names)?.number
  return typeof value === 'number' ? value : null
}

function checkboxValue(page: NotionPage, names: string[]): boolean {
  return Boolean(getProp(page, names)?.checkbox)
}

function dateValue(page: NotionPage, names: string[]): { date: string | null; time: string | null } {
  const start = getProp(page, names)?.date?.start ?? null
  if (!start) return { date: null, time: null }
  const [datePart, timePart] = start.split('T')
  return { date: datePart || null, time: timePart ? timePart.slice(0, 5) : null }
}

function mapStatus(value: string): ActivityStatus {
  const s = value.trim().toLowerCase()
  if (['past', '已完成', '往期', 'completed'].includes(s)) return 'past'
  if (['coming soon', 'coming_soon', '即将上线', '草稿', 'draft'].includes(s)) {
    return 'coming_soon'
  }
  return 'upcoming'
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

function normalizeNotionActivities(rows: NotionPage[]): ActivitiesPayload {
  const categoryMap = new Map<string, CategoryRecord>()
  const upcoming: ActivityRecord[] = []
  const partners: PartnerRecord[] = []
  const tickets: TicketRecord[] = []

  for (const row of rows) {
    const isPartner = checkboxValue(row, ['是否友社活动', '友社活动', 'Partner Event'])
    const categoryMeta = resolveCategory(selectValue(row, ['分类', 'Category', '类目']))
    const status = mapStatus(selectValue(row, ['状态', 'Status']))
    const { date, time } = dateValue(row, ['开始时间', '日期', 'Date'])
    const title = textValue(row, ['活动名称', '名称', 'Name', 'Title']) || '未命名活动'
    const description = textValue(row, ['简介', '描述', 'Description'])
    const poster = urlValue(row, ['海报图片 URL', '海报图片', '海报', 'Poster', 'Poster URL'])
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
      partners.push({
        id: row.id,
        partnerName: textValue(row, ['友社名称', 'Partner Name', '友社']) || '友社',
        partnerNameEn: textValue(row, ['友社名称（英文）', 'Partner Name (English)']) || null,
        eventName: title,
        date,
        description: description || null,
        url: urlValue(row, ['友社链接', 'Partner URL']) || registerUrl || '#',
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
