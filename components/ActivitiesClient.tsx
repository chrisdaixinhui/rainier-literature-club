'use client'

import { useMemo, useState } from 'react'
import type { ActivitiesPayload, ActivityRecord, PartnerRecord } from '@/lib/types'

interface PinnedCardData {
  id: string
  title: string
  titleEn?: string | null
  sourceLabel: string
  sourceName?: string | null
  date?: string | null
  time?: string | null
  location?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  href?: string | null
  comingSoon?: boolean
  partner?: boolean
}

interface PastActivity {
  event: ActivityRecord
  categoryId: string
  categoryName: string
  categoryColor: string
}

function ImgPlaceholder({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: '#E8E3DA',
        border: '1px solid #E6E2DA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8FA499" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#8FA499', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  )
}

function Paragraphs({
  text,
  gap = 16,
  style,
}: {
  text?: string | null
  gap?: number
  style?: React.CSSProperties
}) {
  if (!text) return null
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: 1.9,
            color: 'rgba(28,34,32,0.72)',
            marginBottom: index < paragraphs.length - 1 ? gap : 0,
            ...style,
          }}
        >
          {paragraph}
        </p>
      ))}
    </>
  )
}

function hasUsableUrl(url?: string | null): url is string {
  return Boolean(url && url.trim() && url.trim() !== '#')
}

function compareUpcomingDates(
  a: { date?: string | null; title?: string },
  b: { date?: string | null; title?: string },
): number {
  if (a.date && b.date) return a.date.localeCompare(b.date) || String(a.title ?? '').localeCompare(String(b.title ?? ''))
  if (a.date) return -1
  if (b.date) return 1
  return String(a.title ?? '').localeCompare(String(b.title ?? ''))
}

function comparePastDates(a: PastActivity, b: PastActivity): number {
  if (a.event.date && b.event.date) return b.event.date.localeCompare(a.event.date)
  if (a.event.date) return -1
  if (b.event.date) return 1
  return a.event.title.localeCompare(b.event.title)
}

function PinnedActivityCard({ item }: { item: PinnedCardData }) {
  const accent = item.partner ? '#65756E' : '#2E463D'
  const actionLabel = item.partner
    ? '了解详情 · Learn More'
    : item.comingSoon
      ? '预约提醒 · Notify Me'
      : '立即报名 · Register'

  return (
    <article
      style={{
        border: '1px solid #E6E2DA',
        background: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1250 / 1667', overflow: 'hidden' }}>
        {item.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.poster}
            alt={`${item.title} 活动海报`}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <ImgPlaceholder label="活动海报 · 1250 × 1667" style={{ position: 'absolute', inset: 0 }} />
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid #E6E2DA',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: 'clamp(28px, 4vw, 40px) clamp(24px, 5vw, 48px)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: accent,
              background: `${accent}14`,
              padding: '5px 12px',
            }}
          >
            {item.sourceLabel}
          </span>
          {item.comingSoon && (
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: '#8A6A42',
                background: '#8A6A4212',
                padding: '5px 12px',
              }}
            >
              日期待定 · COMING SOON
            </span>
          )}
        </div>

        <div>
          {item.sourceName && (
            <p
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '11px',
                color: '#68736E',
                letterSpacing: '0.1em',
                marginBottom: '10px',
              }}
            >
              {item.sourceName}
            </p>
          )}
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(22px, 3vw, 34px)',
              fontWeight: 700,
              color: '#1C2220',
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </h3>
          {item.titleEn && (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#8FA499',
                marginTop: '8px',
              }}
            >
              {item.titleEn}
            </p>
          )}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
          style={{ padding: '18px 22px', border: '1px solid #E6E2DA', background: '#F9F7F4' }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em', color: '#8FA499', marginBottom: '6px' }}>
              DATE · 日期
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1C2220' }}>
              {item.date ? `${item.date}${item.time ? ` ${item.time}` : ''}` : '日期待定'}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em', color: '#8FA499', marginBottom: '6px' }}>
              LOCATION · 地点
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1C2220' }}>
              {item.location || '地点待公布'}
            </p>
          </div>
        </div>

        <Paragraphs text={item.description} gap={18} />
        {item.descriptionEn && (
          <Paragraphs
            text={item.descriptionEn}
            gap={18}
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#68736E' }}
          />
        )}

        {hasUsableUrl(item.href) && (
          <div style={{ marginTop: '4px' }}>
            <a href={item.href} className={item.partner ? 'btn-outline' : 'btn-filled'} target="_blank" rel="noreferrer">
              {actionLabel}
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

function EventRow({
  event,
  categoryName,
  categoryColor,
}: {
  event: ActivityRecord
  categoryName: string
  categoryColor: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <article className="event-row" style={{ borderBottom: '1px solid #E6E2DA', overflow: 'hidden' }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        style={{
          display: 'grid',
          gridTemplateColumns: '35% 1fr',
          width: '100%',
          padding: 0,
          border: 0,
          background: 'transparent',
          textAlign: 'left',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        {event.poster ? (
          <div style={{ position: 'relative', aspectRatio: '1250 / 1667', minHeight: '160px', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.poster}
              alt={`${event.title} 活动海报`}
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ) : (
          <ImgPlaceholder label={`海报 · ${event.title}`} style={{ aspectRatio: '1250 / 1667', minHeight: '160px' }} />
        )}

        <div
          className="flex flex-col justify-center"
          style={{ padding: '24px clamp(16px, 4vw, 32px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                padding: '2px 8px',
                color: categoryColor,
                background: `${categoryColor}18`,
              }}
            >
              {event.subType || categoryName}
            </span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(15px, 2vw, 19px)',
              fontWeight: 700,
              color: '#1C2220',
              lineHeight: 1.3,
              marginBottom: '8px',
            }}
          >
            {event.title}
          </h3>
          {event.date && (
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', letterSpacing: '0.08em' }}>
              {event.date}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#8FA499', letterSpacing: '0.12em' }}>
              {open ? '收起' : '展开详情'}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="#8FA499"
              strokeWidth="1.2"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
            >
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </div>
        </div>
      </button>

      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div
          style={{
            background: '#F9F7F4',
            borderTop: '1px solid #E6E2DA',
            padding: '32px clamp(24px, 4vw, 40px)',
          }}
        >
          <Paragraphs text={event.description} gap={14} style={{ maxWidth: '62ch', marginBottom: event.reviewUrl ? '20px' : 0 }} />
          {hasUsableUrl(event.reviewUrl) && (
            <a
              href={event.reviewUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                color: '#2E463D',
                letterSpacing: '0.08em',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              查看活动回顾 →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function activityToPinnedCard(event: ActivityRecord): PinnedCardData {
  return {
    id: event.id,
    title: event.title,
    titleEn: event.titleEn,
    sourceLabel: '雨山前活动 · UPCOMING',
    date: event.date,
    time: event.time,
    location: event.location,
    description: event.description,
    descriptionEn: event.descriptionEn,
    poster: event.poster,
    href: event.registerUrl,
    comingSoon: event.comingSoon,
  }
}

function partnerToPinnedCard(partner: PartnerRecord): PinnedCardData {
  return {
    id: partner.id,
    title: partner.eventName,
    titleEn: partner.eventNameEn,
    sourceLabel: '友社推荐 · PARTNER PICK',
    sourceName: partner.partnerName,
    date: partner.date,
    time: partner.time,
    location: partner.location,
    description: partner.description,
    descriptionEn: partner.descriptionEn,
    poster: partner.poster,
    href: partner.url,
    comingSoon: partner.comingSoon,
    partner: true,
  }
}

export default function ActivitiesClient({ initialData }: { initialData: ActivitiesPayload }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const rainierPinned = useMemo(
    () => [...initialData.upcoming].sort((a, b) => compareUpcomingDates(a, b)).map(activityToPinnedCard),
    [initialData.upcoming],
  )

  const partnerPinned = useMemo(
    () =>
      initialData.partners
        .filter((partner) => partner.status !== 'past')
        .sort((a, b) => compareUpcomingDates({ date: a.date, title: a.eventName }, { date: b.date, title: b.eventName }))
        .map(partnerToPinnedCard),
    [initialData.partners],
  )

  const pastActivities = useMemo(
    () =>
      initialData.categories
        .flatMap((category) =>
          category.events
            .filter((event) => event.status === 'past')
            .map((event) => ({
              event,
              categoryId: category.id,
              categoryName: category.name,
              categoryColor: category.color,
            })),
        )
        .sort(comparePastDates),
    [initialData.categories],
  )

  const pastCategories = useMemo(
    () =>
      initialData.categories.filter((category) =>
        pastActivities.some((activity) => activity.categoryId === category.id),
      ),
    [initialData.categories, pastActivities],
  )

  const visiblePastActivities = selectedCategory === 'all'
    ? pastActivities
    : pastActivities.filter((activity) => activity.categoryId === selectedCategory)

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      <header
        style={{
          padding: '120px clamp(16px, 3vw, 24px) 56px',
          textAlign: 'center',
          borderBottom: '1px solid #E6E2DA',
        }}
      >
        <p className="label-sm" style={{ marginBottom: '16px' }}>
          Activities · 活动
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#1C2220',
          }}
        >
          我们的活动
        </h1>
        <p
          style={{
            maxWidth: '560px',
            margin: '18px auto 0',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: 1.8,
            color: '#68736E',
          }}
        >
          在这里找到下一次相聚，也翻阅我们共同留下的阅读现场。
        </p>
      </header>

      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '72px clamp(16px, 3vw, 24px) 96px',
        }}
      >
        <section aria-labelledby="rainier-upcoming-heading">
          <div style={{ marginBottom: '36px' }}>
            <p className="label-sm" style={{ marginBottom: '12px' }}>
              Pinned · 置顶
            </p>
            <h2
              id="rainier-upcoming-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
            >
              雨山前活动
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
              Upcoming by Rainier Literature Society
            </p>
          </div>

          {rainierPinned.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {rainierPinned.map((item) => (
                <PinnedActivityCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '72px 24px', textAlign: 'center', border: '1px dashed #D8D2C8' }}>
              <p style={{ fontSize: '40px', opacity: 0.15, marginBottom: '14px' }}>🌧️</p>
              <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', fontSize: '14px' }}>
                新活动正在路上 · More gatherings coming soon
              </p>
            </div>
          )}
        </section>

        {partnerPinned.length > 0 && (
          <section aria-labelledby="partner-heading" style={{ marginTop: '96px', paddingTop: '72px', borderTop: '1px solid #D8D2C8' }}>
            <div style={{ marginBottom: '36px' }}>
              <p className="label-sm" style={{ marginBottom: '12px' }}>
                Partner Picks · 置顶
              </p>
              <h2
                id="partner-heading"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
              >
                友社推荐
              </h2>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
                Events from Friends & Partners
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {partnerPinned.map((item) => (
                <PinnedActivityCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="past-events-heading" style={{ marginTop: '104px', paddingTop: '72px', borderTop: '1px solid #D8D2C8' }}>
          <div style={{ marginBottom: '32px' }}>
            <p className="label-sm" style={{ marginBottom: '12px' }}>
              Archive · 往期
            </p>
            <h2
              id="past-events-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
            >
              往期活动
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
              Past Events
            </p>
          </div>

          {pastActivities.length > 0 ? (
            <>
              <div
                aria-label="往期活动分类"
                style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  aria-pressed={selectedCategory === 'all'}
                  style={{
                    flexShrink: 0,
                    border: `1px solid ${selectedCategory === 'all' ? '#2E463D' : '#D8D2C8'}`,
                    background: selectedCategory === 'all' ? '#2E463D' : 'transparent',
                    color: selectedCategory === 'all' ? '#FFFFFF' : '#68736E',
                    padding: '9px 16px',
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  全部 · ALL
                </button>
                {pastCategories.map((category) => {
                  const active = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      aria-pressed={active}
                      style={{
                        flexShrink: 0,
                        border: `1px solid ${active ? category.color : '#D8D2C8'}`,
                        background: active ? category.color : 'transparent',
                        color: active ? '#FFFFFF' : '#68736E',
                        padding: '9px 16px',
                        fontFamily: 'var(--font-label)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                      }}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>

              <div className="event-rows" style={{ border: '1px solid #E6E2DA', borderBottom: 0 }}>
                {visiblePastActivities.map((activity) => (
                  <EventRow
                    key={activity.event.id}
                    event={activity.event}
                    categoryName={activity.categoryName}
                    categoryColor={activity.categoryColor}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '64px 24px', textAlign: 'center', border: '1px dashed #D8D2C8' }}>
              <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', fontSize: '14px' }}>往期内容整理中</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
