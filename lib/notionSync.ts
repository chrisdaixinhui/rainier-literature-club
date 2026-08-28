import { isCloudinaryConfigured, uploadImageToCloudinary } from './cloudinary.ts'

const NOTION_VERSION = '2022-06-28'
const NOTION_REQUEST_TIMEOUT_MS = 15_000

interface NotionPage {
  id: string
  last_edited_time?: string
  properties: Record<string, NotionPropertyValue>
}

interface NotionPropertyValue {
  type?: string
  title?: Array<{ plain_text?: string }>
  rich_text?: Array<{ plain_text?: string }>
  url?: string | null
  files?: NotionFileValue[]
}

interface NotionFileValue {
  name?: string
  url?: string
  file?: { url?: string }
  external?: { url?: string }
}

interface SyncFile {
  name: string
  url?: string
  externalUrl?: string
}

export interface SyncResult {
  synced: number
  skipped: number
  errors: Array<{ id: string; title: string; error: string }>
}

function notionHeaders(): Record<string, string> {
  const token = process.env.NOTION_API_KEY
  if (!token) throw new Error('NOTION_API_KEY is not configured')
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function isNotionPageShape(value: unknown): value is NotionPage {
  if (!isRecord(value) || typeof value.id !== 'string' || !isRecord(value.properties)) {
    return false
  }
  return value.last_edited_time === undefined || typeof value.last_edited_time === 'string'
}

async function queryActivityPages(): Promise<NotionPage[]> {
  const databaseId = process.env.NOTION_ACTIVITY_DB_ID
  if (!databaseId) throw new Error('NOTION_ACTIVITY_DB_ID is not configured')

  const pages: NotionPage[] = []
  const seenCursors = new Set<string>()
  let cursor: string | undefined

  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
      signal: AbortSignal.timeout(NOTION_REQUEST_TIMEOUT_MS),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Notion query failed (${res.status}): ${detail.slice(0, 300)}`)
    }

    let body: unknown
    try {
      body = await res.json()
    } catch {
      throw new Error('Notion returned invalid JSON')
    }

    if (!isRecord(body) || !Array.isArray(body.results)) {
      throw new Error('Notion response is missing results')
    }

    for (const page of body.results) {
      if (!isNotionPageShape(page)) {
        throw new Error('Notion response contains an invalid activity page')
      }
      pages.push(page)
    }

    if (typeof body.has_more !== 'boolean') {
      throw new Error('Notion response has an invalid pagination flag')
    }

    const hasMore = body.has_more
    if (
      body.next_cursor !== undefined &&
      body.next_cursor !== null &&
      typeof body.next_cursor !== 'string'
    ) {
      throw new Error('Notion response has an invalid pagination cursor')
    }
    const nextCursor = typeof body.next_cursor === 'string' ? body.next_cursor : undefined
    if (!hasMore) {
      if (nextCursor) {
        throw new Error('Notion response has an unexpected pagination cursor')
      }
      cursor = undefined
      continue
    }
    if (!nextCursor || seenCursors.has(nextCursor)) {
      throw new Error('Notion pagination returned an invalid cursor')
    }
    seenCursors.add(nextCursor)
    cursor = nextCursor
  } while (cursor)

  return pages
}

function getTitle(page: NotionPage): string {
  const prop = page.properties['活动名称']
  const parts = prop?.title ?? []
  return parts.map((t) => t?.plain_text ?? '').join('').trim()
}

function getFilesProperty(page: NotionPage): SyncFile[] {
  const prop = page.properties['海报图片']
  if (prop?.type !== 'files' || !prop.files) return []

  return prop.files
    .map((f) => ({
      name: typeof f.name === 'string' ? f.name : 'poster',
      url: typeof f.file?.url === 'string' ? f.file.url : undefined,
      externalUrl: typeof f.external?.url === 'string' ? f.external.url : undefined,
    }))
    .filter((f: { url?: string; externalUrl?: string }) => f.url || f.externalUrl)
}

function getSyncMarker(page: NotionPage): string {
  const prop = page.properties['海报图片同步标记']
  const parts = prop?.rich_text ?? []
  return parts.map((t) => t?.plain_text ?? '').join('')
}

function fingerprint(page: NotionPage, file: SyncFile): string {
  if (file.externalUrl) return `ext|${file.name}|${file.externalUrl}`
  if (file.url) {
    try {
      return `file|${file.name}|${new URL(file.url).pathname}`
    } catch {
      return `file|${file.name}|${file.url}`
    }
  }
  return `file|${file.name}|${page.last_edited_time ?? ''}`
}

async function updatePagePoster(pageId: string, url: string, marker: string) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: notionHeaders(),
    body: JSON.stringify({
      properties: {
        '海报图片 URL': { url },
        '海报图片同步标记': {
          rich_text: [{ text: { content: marker } }],
        },
      },
    }),
    signal: AbortSignal.timeout(NOTION_REQUEST_TIMEOUT_MS),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Notion update failed (${res.status}): ${detail.slice(0, 300)}`)
  }
}

/**
 * Scans the Notion activity database and re-hosts any image attached to the
 * `海报图片` field to Cloudinary, then writes the permanent URL back into
 * `海报图片 URL`. Already-synced images are skipped using `海报图片同步标记`.
 */
export async function syncActivityPosters(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] }

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_ACTIVITY_DB_ID) {
    throw new Error('Notion is not configured')
  }
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  const pages = await queryActivityPages()

  for (const page of pages) {
    const title = getTitle(page)
    try {
      const files = getFilesProperty(page)
      if (files.length === 0) {
        result.skipped += 1
        continue
      }

      const file = files[0]
      const marker = fingerprint(page, file)
      if (getSyncMarker(page) === marker) {
        result.skipped += 1
        continue
      }

      const downloadUrl = file.externalUrl ?? file.url
      if (!downloadUrl) {
        result.skipped += 1
        continue
      }

      const downloadRes = await fetch(downloadUrl)
      if (!downloadRes.ok) {
        throw new Error(`download failed (${downloadRes.status})`)
      }
      const buffer = Buffer.from(await downloadRes.arrayBuffer())

      const upload = await uploadImageToCloudinary(buffer, file.name)
      await updatePagePoster(page.id, upload.secureUrl, marker)
      result.synced += 1
    } catch (err) {
      result.errors.push({
        id: page.id,
        title,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return result
}
