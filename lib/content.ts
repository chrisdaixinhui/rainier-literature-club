import { connection } from 'next/server'
import {
  getNotionActivitySnapshot,
  hasNotionActivityDatabase,
  normalizeNotionActivities,
} from './notion'
import type { NotionActivitySnapshot } from './notion'
import type {
  ActivitiesPayload,
  ActivityRecord,
  ActivityStatus,
  CategoryRecord,
  PartnerRecord,
  TicketRecord,
} from './types'
import staticData from '../data/activities.json'
import { resolveActivityState } from './activityStatus'

/**
 * Single entry point for activity content.
 *
 * Notion is refreshed into a durable Next/Vercel Data Cache snapshot. Pages
 * read that snapshot and normalize it against the current clock. The page
 * waits for the request before reading time; the snapshot itself remains in
 * the durable Data Cache. Static data is only used when no successful snapshot
 * has ever been stored.
 */
export async function getActivitiesPayload(): Promise<ActivitiesPayload> {
  await connection()

  const hasDatabase = hasNotionActivityDatabase()
  let snapshot: NotionActivitySnapshot | null = null
  if (hasDatabase) {
    try {
      snapshot = await getNotionActivitySnapshot()
    } catch {
      // The snapshot loader logs the upstream error. Static data is only the
      // bootstrap path when no successful snapshot exists yet.
    }
  }

  if (snapshot) {
    return {
      ...normalizeNotionActivities(snapshot.rows, new Date()),
      source: 'notion',
      syncedAt: snapshot.syncedAt,
    }
  }

  console.warn(JSON.stringify({
    scope: 'notion-activities',
    event: 'using-static-fallback',
    reason: hasDatabase ? 'no-successful-snapshot' : 'not-configured',
  }))

  return {
    ...normalizeStaticData(staticData as unknown as StaticDataShape),
    source: 'static-fallback',
    syncedAt: null,
  }
}

interface StaticActivityInput {
  id?: string
  title?: string
  titleEn?: string | null
  subType?: string | null
  date?: string | null
  time?: string | null
  endAt?: string | null
  location?: string | null
  locationDetail?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  registerUrl?: string | null
  reviewUrl?: string | null
  generalPrice?: number | null
  supporterPrice?: number | null
  supporterPerks?: string | null
  comingSoon?: boolean
  featured?: boolean
  status?: ActivityStatus
}

interface StaticCategoryInput {
  id?: string
  name?: string
  nameEn?: string
  tagline?: string
  taglineEn?: string
  color?: string
  textColor?: string
  comingSoon?: boolean
  events?: StaticActivityInput[]
}

interface StaticPartnerInput {
  id?: string
  partnerName?: string
  partnerNameEn?: string | null
  eventName?: string
  eventNameEn?: string | null
  date?: string | null
  time?: string | null
  endAt?: string | null
  location?: string | null
  locationDetail?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  url?: string | null
  comingSoon?: boolean
  status?: ActivityStatus
}

interface StaticTicketInput {
  id?: string
  activityId?: string | null
  title?: string
  date?: string | null
  time?: string | null
  location?: string | null
  generalPrice?: number | null
  generalUrl?: string | null
  supporterPrice?: number | null
  supporterUrl?: string | null
  supporterPerks?: string | null
  comingSoon?: boolean
}

interface StaticDataShape {
  upcoming: StaticActivityInput[]
  categories: StaticCategoryInput[]
  partners: StaticPartnerInput[]
  tickets: StaticTicketInput[]
}

function toActivity(
  ev: StaticActivityInput,
  fallbackStatus: ActivityStatus = 'upcoming',
): ActivityRecord | null {
  const rawStatus = ev.status ?? (ev.comingSoon ? 'coming_soon' : fallbackStatus)
  const status = resolveActivityState({ rawStatus, startDate: ev.date, endAt: ev.endAt })
  if (status === 'hidden') return null

  return {
    id: String(ev.id ?? ''),
    title: String(ev.title ?? ''),
    titleEn: ev.titleEn ?? null,
    subType: ev.subType ?? null,
    date: ev.date ?? null,
    time: ev.time ?? null,
    endAt: ev.endAt ?? null,
    location: ev.location ?? null,
    locationDetail: ev.locationDetail ?? null,
    description: ev.description ?? null,
    descriptionEn: ev.descriptionEn ?? null,
    poster: ev.poster ?? null,
    registerUrl: ev.registerUrl ?? null,
    reviewUrl: ev.reviewUrl ?? null,
    featured: Boolean(ev.featured),
    comingSoon: status === 'coming_soon',
    status,
  }
}

function normalizeStaticData(data: StaticDataShape): ActivitiesPayload {
  const categories: CategoryRecord[] = (data.categories ?? []).map((cat) => ({
    id: String(cat.id ?? ''),
    name: String(cat.name ?? ''),
    nameEn: String(cat.nameEn ?? ''),
    tagline: String(cat.tagline ?? ''),
    taglineEn: String(cat.taglineEn ?? ''),
    color: String(cat.color ?? '#2E463D'),
    textColor: String(cat.textColor ?? '#ffffff'),
    comingSoon: Boolean(cat.comingSoon),
    events: (cat.events ?? [])
      .map((ev) => toActivity(ev))
      .filter((ev): ev is ActivityRecord => ev !== null),
  }))

  const partners: PartnerRecord[] = (data.partners ?? []).flatMap((p) => {
    const rawStatus = p.status ?? (p.comingSoon ? 'coming_soon' : 'upcoming')
    const status = resolveActivityState({ rawStatus, startDate: p.date, endAt: p.endAt })
    if (status === 'hidden' || status === 'past') return []

    return [{
      id: String(p.id ?? ''),
      partnerName: String(p.partnerName ?? ''),
      partnerNameEn: p.partnerNameEn ?? null,
      eventName: String(p.eventName ?? ''),
      eventNameEn: p.eventNameEn ?? null,
      date: p.date ?? null,
      time: p.time ?? null,
      endAt: p.endAt ?? null,
      location: p.location ?? null,
      locationDetail: p.locationDetail ?? null,
      description: p.description ?? null,
      descriptionEn: p.descriptionEn ?? null,
      poster: p.poster ?? null,
      url: p.url ?? null,
      comingSoon: status === 'coming_soon',
      status,
    }]
  })

  const tickets: TicketRecord[] = (data.tickets ?? []).flatMap((t) => {
    const status = resolveActivityState({
      rawStatus: t.comingSoon ? 'coming_soon' : 'upcoming',
      startDate: t.date,
    })
    if (status === 'hidden' || status === 'past') return []

    return [{
      id: String(t.id ?? ''),
      activityId: t.activityId ?? null,
      title: String(t.title ?? ''),
      date: t.date ?? null,
      time: t.time ?? null,
      location: t.location ?? null,
      generalPrice: t.generalPrice ?? null,
      generalUrl: t.generalUrl ?? null,
      supporterPrice: t.supporterPrice ?? null,
      supporterUrl: t.supporterUrl ?? null,
      supporterPerks: t.supporterPerks ?? null,
      comingSoon: status === 'coming_soon',
    }]
  })

  return {
    upcoming: (data.upcoming ?? [])
      .map((ev) => toActivity(ev))
      .filter((ev): ev is ActivityRecord => ev !== null && ev.status !== 'past'),
    categories,
    partners,
    tickets,
  }
}
