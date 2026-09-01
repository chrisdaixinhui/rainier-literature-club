'use client'

import { useMemo, useState } from 'react'
import type { ActivitiesPayload, ActivityLanguage, ActivityRecord, PartnerRecord } from '@/lib/types'
import type { Dictionary } from '@/lib/i18n-types'

interface PinnedCardData {
  id: string
  title: string
  titleEn?: string | null
  sourceLabel: string
  sourceName?: string | null
  date?: string | null
  time?: string | null
  location?: string | null
  locationDetail?: string | null
  description?: string | null
  descriptionEn?: string | null
  poster?: string | null
  href?: string | null
  comingSoon?: boolean
  partner?: boolean
  activityLanguage?: ActivityLanguage | null
}

interface PastActivity {
  event: ActivityRecord
  categoryId: string
  categoryName: string
  categoryColor: string
}

const PAST_POSTER_WIDTHS = [320, 480, 640] as const
const CLOUDINARY_UPLOAD_PATH = '/image/upload/'

function cloudinaryPastPosterUrl(src: string, width: number): string {
  try {
    const url = new URL(src)
    if (url.hostname !== 'res.cloudinary.com' || !url.pathname.includes(CLOUDINARY_UPLOAD_PATH)) return src

    const transformation = `f_auto,q_auto:good,c_fill,g_center,ar_1250:1667,w_${width}`
    url.pathname = url.pathname.replace(CLOUDINARY_UPLOAD_PATH, `${CLOUDINARY_UPLOAD_PATH}${transformation}/`)
    return url.toString()
  } catch {
    return src
  }
}

function pastPosterSrcSet(src: string): string | undefined {
  const urls = PAST_POSTER_WIDTHS.map((width) => cloudinaryPastPosterUrl(src, width))
  if (urls.every((url) => url === src)) return undefined
  return urls.map((url, index) => `${url} ${PAST_POSTER_WIDTHS[index]}w`).join(', ')
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

function PinnedActivityCard({
  item,
  copy,
  activityLanguageCopy,
}: {
  item: PinnedCardData
  copy: Dictionary['activities']
  activityLanguageCopy: Dictionary['activityLanguage']
}) {
  const accent = item.partner ? '#65756E' : '#2E463D'
  const actionLabel = item.partner
    ? copy.learnMore
    : copy.register
  const schedule = [item.date, item.time].filter(Boolean).join(' ')
  const place = [item.location, item.locationDetail].filter(Boolean).join(' · ')

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
            alt={`${item.title} ${copy.posterAlt}`}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <ImgPlaceholder label={copy.posterPlaceholder} style={{ position: 'absolute', inset: 0 }} />
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
              {copy.comingSoon}
            </span>
          )}
          {item.activityLanguage && (
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: '#65756E',
                background: '#65756E12',
                padding: '5px 12px',
              }}
            >
              {activityLanguageCopy[item.activityLanguage]}
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
          <p
            style={{
              marginTop: '14px',
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              lineHeight: 1.7,
              letterSpacing: '0.08em',
              color: '#68736E',
            }}
          >
            {schedule || copy.timeTba} · {place || copy.placeTba}
          </p>
        </div>

        <Paragraphs text={item.description} gap={18} />
        {item.descriptionEn && (
          <Paragraphs
            text={item.descriptionEn}
            gap={18}
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#68736E' }}
          />
        )}

        <div style={{ marginTop: '4px' }}>
          {hasUsableUrl(item.href) ? (
            <a href={item.href} className={item.partner ? 'btn-outline' : 'btn-filled'} target="_blank" rel="noreferrer">
              {actionLabel}
            </a>
          ) : (
            <span className="btn-outline" aria-disabled="true" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
              {item.partner ? copy.learnMoreDisabled : copy.registerDisabled}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function EventRow({
  event,
  categoryName,
  categoryColor,
  copy,
  activityLanguageCopy,
}: {
  event: ActivityRecord
  categoryName: string
  categoryColor: string
  copy: Dictionary['activities']
  activityLanguageCopy: Dictionary['activityLanguage']
}) {
  const [open, setOpen] = useState(false)
  const detailsId = `event-details-${event.id}`
  const toggleOpen = () => setOpen((value) => !value)

  return (
    <article className={`event-row ${open ? 'is-open' : ''}`} style={{ borderBottom: '1px solid #E6E2DA', overflow: 'hidden' }}>
      <div className="event-row-layout">
        <button
          type="button"
          className="event-row-poster-toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`${open ? copy.collapse : copy.expand} ${event.title} ${copy.details}`}
          onClick={toggleOpen}
        >
          {event.poster ? (
            <div className="event-row-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cloudinaryPastPosterUrl(event.poster, 640)}
                srcSet={pastPosterSrcSet(event.poster)}
                sizes="(max-width: 640px) 35vw, 320px"
                alt={`${event.title} ${copy.posterAlt}`}
                loading="lazy"
                decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            <ImgPlaceholder label={`${copy.posterAlt} · ${event.title}`} style={{ aspectRatio: '1250 / 1667', minHeight: '160px' }} />
          )}
        </button>

        <div className="event-row-copy">
          <button
            type="button"
            className="event-row-summary-toggle"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={toggleOpen}
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
              {event.activityLanguage && (
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: '#65756E',
                  }}
                >
                  {activityLanguageCopy[event.activityLanguage]}
                </span>
              )}
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
                {open ? copy.collapse : copy.expand}
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
          </button>

          <div
            id={detailsId}
            className={`accordion-content ${open ? 'open' : ''}`}
            aria-hidden={!open}
            inert={!open}
          >
            <div className="event-row-details">
              <Paragraphs text={event.description} gap={14} style={{ marginBottom: event.reviewUrl ? '20px' : 0 }} />
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
                  {copy.review}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function activityToPinnedCard(event: ActivityRecord, copy: Dictionary['activities']): PinnedCardData {
  return {
    id: event.id,
    title: event.title,
    titleEn: event.titleEn,
    sourceLabel: copy.rainierSource,
    date: event.date,
    time: event.time,
    location: event.location,
    locationDetail: event.locationDetail,
    description: event.description,
    descriptionEn: event.descriptionEn,
    poster: event.poster,
    href: event.registerUrl,
    comingSoon: event.comingSoon,
    activityLanguage: event.activityLanguage,
  }
}

function partnerToPinnedCard(partner: PartnerRecord, copy: Dictionary['activities']): PinnedCardData {
  return {
    id: partner.id,
    title: partner.eventName,
    titleEn: partner.eventNameEn,
    sourceLabel: copy.partnerSource,
    sourceName: partner.partnerName,
    date: partner.date,
    time: partner.time,
    location: partner.location,
    locationDetail: partner.locationDetail,
    description: partner.description,
    descriptionEn: partner.descriptionEn,
    poster: partner.poster,
    href: partner.url,
    comingSoon: partner.comingSoon,
    partner: true,
    activityLanguage: partner.activityLanguage,
  }
}

export default function ActivitiesClient({
  initialData,
  copy,
  activityLanguageCopy,
}: {
  initialData: ActivitiesPayload
  copy: Dictionary['activities']
  activityLanguageCopy: Dictionary['activityLanguage']
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const rainierPinned = useMemo(
    () => [...initialData.upcoming].sort((a, b) => compareUpcomingDates(a, b)).map((event) => activityToPinnedCard(event, copy)),
    [copy, initialData.upcoming],
  )

  const partnerPinned = useMemo(
    () =>
      initialData.partners
        .filter((partner) => partner.status !== 'past')
        .sort((a, b) => compareUpcomingDates({ date: a.date, title: a.eventName }, { date: b.date, title: b.eventName }))
        .map((partner) => partnerToPinnedCard(partner, copy)),
    [copy, initialData.partners],
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
          {copy.eyebrow}
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
          {copy.title}
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
          {copy.intro}
        </p>
        {initialData.source === 'static-fallback' && (
          <p
            role="status"
            style={{
              maxWidth: '560px',
              margin: '14px auto 0',
              fontFamily: 'var(--font-label)',
              fontSize: '10px',
              lineHeight: 1.7,
              letterSpacing: '0.08em',
              color: '#8A6A42',
            }}
          >
            {copy.fallbackNotice}
          </p>
        )}
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
              {copy.pinnedEyebrow}
            </p>
            <h2
              id="rainier-upcoming-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
            >
              {copy.rainierHeading}
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
              {copy.rainierAccent}
            </p>
          </div>

          {rainierPinned.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {rainierPinned.map((item) => (
                <PinnedActivityCard key={item.id} item={item} copy={copy} activityLanguageCopy={activityLanguageCopy} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '72px 24px', textAlign: 'center', border: '1px dashed #D8D2C8' }}>
              <p style={{ fontSize: '40px', opacity: 0.15, marginBottom: '14px' }}>🌧️</p>
              <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', fontSize: '14px' }}>
                {copy.noUpcoming}
              </p>
            </div>
          )}
        </section>

        {partnerPinned.length > 0 && (
          <section aria-labelledby="partner-heading" style={{ marginTop: '96px', paddingTop: '72px', borderTop: '1px solid #D8D2C8' }}>
            <div style={{ marginBottom: '36px' }}>
              <p className="label-sm" style={{ marginBottom: '12px' }}>
                {copy.partnerEyebrow}
              </p>
              <h2
                id="partner-heading"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
              >
                {copy.partnerHeading}
              </h2>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
                {copy.partnerAccent}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {partnerPinned.map((item) => (
                <PinnedActivityCard key={item.id} item={item} copy={copy} activityLanguageCopy={activityLanguageCopy} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="past-events-heading" style={{ marginTop: '104px', paddingTop: '72px', borderTop: '1px solid #D8D2C8' }}>
          <div style={{ marginBottom: '32px' }}>
            <p className="label-sm" style={{ marginBottom: '12px' }}>
              {copy.archiveEyebrow}
            </p>
            <h2
              id="past-events-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#1C2220' }}
            >
              {copy.archiveHeading}
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', marginTop: '8px' }}>
              {copy.archiveAccent}
            </p>
          </div>

          {pastActivities.length > 0 ? (
            <>
              <div
                aria-label={copy.categoryFilterAria}
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
                  {copy.allCategories}
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
                    copy={copy}
                    activityLanguageCopy={activityLanguageCopy}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '64px 24px', textAlign: 'center', border: '1px dashed #D8D2C8' }}>
              <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', fontSize: '14px' }}>{copy.noPast}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
