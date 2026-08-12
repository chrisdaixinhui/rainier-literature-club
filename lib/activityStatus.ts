import type { ActivityStatus } from './types'

export const ACTIVITY_TIME_ZONE = 'America/Los_Angeles'

type ResolvedActivityState = ActivityStatus | 'hidden'

const HIDDEN_STATUSES = new Set([
  'draft',
  '草稿',
  'cancelled',
  'canceled',
  '取消',
  '已取消',
  '隐藏',
  'hidden',
])

const PAST_STATUSES = new Set(['past', '已完成', '往期', 'completed', '归档', 'archived'])
const COMING_SOON_STATUSES = new Set(['coming soon', 'coming_soon', '即将上线', '筹备中'])

function normalizedStatus(value?: string | null): string {
  return String(value ?? '').trim().toLowerCase()
}

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const representedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return representedAsUtc - date.getTime()
}

function zonedMidnightUtc(date: string, timeZone: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null

  const initial = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  let utc = initial

  // Two passes handle offset changes around daylight-saving boundaries.
  for (let pass = 0; pass < 2; pass += 1) {
    utc = initial - timeZoneOffsetMs(new Date(utc), timeZone)
  }

  return utc
}

function nextCalendarDate(date: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null
  const next = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + 1))
  return next.toISOString().slice(0, 10)
}

export function activityArchiveTime({
  startDate,
  endAt,
}: {
  startDate?: string | null
  endAt?: string | null
}): number | null {
  if (endAt) {
    const explicitEnd = Date.parse(endAt)
    if (Number.isFinite(explicitEnd)) return explicitEnd
  }

  if (!startDate) return null
  const nextDate = nextCalendarDate(startDate.slice(0, 10))
  return nextDate ? zonedMidnightUtc(nextDate, ACTIVITY_TIME_ZONE) : null
}

export function resolveActivityState({
  rawStatus,
  startDate,
  endAt,
  now = new Date(),
}: {
  rawStatus?: string | null
  startDate?: string | null
  endAt?: string | null
  now?: Date
}): ResolvedActivityState {
  const status = normalizedStatus(rawStatus)

  if (HIDDEN_STATUSES.has(status)) return 'hidden'
  if (PAST_STATUSES.has(status)) return 'past'

  const archiveAt = activityArchiveTime({ startDate, endAt })
  if (archiveAt != null && now.getTime() >= archiveAt) return 'past'

  if (COMING_SOON_STATUSES.has(status)) return 'coming_soon'
  return 'upcoming'
}
