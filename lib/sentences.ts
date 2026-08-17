import { cacheLife, cacheTag } from 'next/cache'

const NOTION_VERSION = '2022-06-28'
export interface SentenceRecord {
  text: string
  translation: string
  author: string
  source: string
}

interface NotionText {
  plain_text?: string
}

interface NotionPage {
  id: string
  properties?: Record<string, {
    type?: string
    title?: NotionText[]
    rich_text?: NotionText[]
    checkbox?: boolean
  }>
}

function readText(page: NotionPage, name: string, title = false): string {
  const prop = page.properties?.[name]
  const parts = title ? prop?.title : prop?.rich_text
  return (parts ?? []).map((item) => item.plain_text ?? '').join('').trim()
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

async function fetchSentenceRows(): Promise<NotionPage[] | null> {
  const databaseId = process.env.NOTION_SENTENCE_DB_ID
  if (!databaseId || !process.env.NOTION_API_KEY) return null

  try {
    const rows: NotionPage[] = []
    let cursor: string | undefined

    do {
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: notionHeaders(),
        body: JSON.stringify({
          page_size: 100,
          start_cursor: cursor,
          filter: {
            property: '是否启用',
            checkbox: { equals: true },
          },
        }),
      })
      if (!response.ok) return null

      const body = (await response.json()) as {
        results?: NotionPage[]
        has_more?: boolean
        next_cursor?: string | null
      }
      rows.push(...(body.results ?? []))
      cursor = body.has_more && body.next_cursor ? body.next_cursor : undefined
    } while (cursor)

    return rows
  } catch {
    return null
  }
}

export async function getSentences(): Promise<SentenceRecord[]> {
  'use cache'
  cacheTag('sentences')
  cacheLife({ stale: 60, revalidate: 600, expire: 3600 })

  const rows = await fetchSentenceRows()
  if (!rows) return []

  return rows
    .map((page) => ({
      text: readText(page, '中文句子', true),
      translation: readText(page, '英文翻译'),
      author: readText(page, '作者'),
      source: readText(page, '出处'),
    }))
    .filter((sentence) => sentence.text)
}
