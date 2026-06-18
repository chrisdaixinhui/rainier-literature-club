'use client'
import { useState } from 'react'
import activitiesData from '@/data/activities.json'

type Tab = 'upcoming' | 'all' | 'partners'

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
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#8FA499', letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
}

// ── Upcoming event: full-width banner + accordion ──
function UpcomingBanner({ ev }: { ev: typeof activitiesData.upcoming[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ border: '1px solid #E6E2DA', overflow: 'hidden' }}>
      {/* Full-width poster */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', minHeight: '280px' }}>
        <ImgPlaceholder label="活动海报 · 1600 × 700" style={{ position: 'absolute', inset: 0 }} />
        {/* Overlay: event title on poster */}
        <div className="px-4 md:px-9" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(20,30,26,0.75) 0%, transparent 50%)',
          display: 'flex', alignItems: 'flex-end', paddingTop: '32px', paddingBottom: '32px',
        }}>
          <div>
            {ev.comingSoon && (
              <span style={{
                display: 'inline-block',
                fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em',
                color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)',
                padding: '4px 12px', marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                即将上线 · COMING SOON
              </span>
            )}
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 3.5vw, 38px)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.2,
            }}>
              {ev.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '8px', letterSpacing: '0.06em' }}>
              {ev.date} · {ev.location}
            </p>
          </div>
        </div>
      </div>

      {/* Expand toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 md:px-9"
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '16px', paddingBottom: '16px', background: '#FAF8F5', cursor: 'pointer',
          borderTop: '1px solid #E6E2DA', transition: 'background 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F2EDE4' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FAF8F5' }}
      >
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.14em', color: '#68736E' }}>
          {open ? '收起详情 CLOSE' : '查看详情 DETAILS'}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#68736E" strokeWidth="1.2"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        >
          <polyline points="3,6 8,11 13,6"/>
        </svg>
      </button>

      {/* Accordion detail panel */}
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="px-4 md:px-9" style={{ paddingTop: '32px', paddingBottom: '36px', borderTop: '1px solid #E6E2DA' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-x-12" style={{ maxWidth: '700px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em', color: '#8FA499', marginBottom: '6px' }}>DATE · 日期</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1C2220' }}>{ev.date} {ev.time}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.16em', color: '#8FA499', marginBottom: '6px' }}>LOCATION · 地点</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1C2220' }}>{ev.location}</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.85, color: 'rgba(28,34,32,0.7)', margin: '24px 0 32px' }}>
            {ev.description}
          </p>
          <a
            href={ev.registerUrl}
            className="btn-filled"
          >
            {ev.comingSoon ? '预约提醒 · Notify Me' : '立即报名 · Register'}
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Past event row — full-width horizontal ──
function EventRow({ ev, catColor }: { ev: any; catColor: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="event-row"
      style={{ borderBottom: '1px solid #E6E2DA', overflow: 'hidden' }}
    >
      {/* Row: poster (left 35%) + info (right 65%) */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '35% 1fr', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <ImgPlaceholder label={`海报 · ${ev.title}`} style={{ aspectRatio: '4/3', minHeight: '160px' }} />
        <div className="px-4 md:px-8 py-6 flex flex-col justify-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.12em',
              padding: '2px 8px', color: catColor,
              background: catColor + '18',
            }}>
              {ev.subType}
            </span>
            {ev.status === 'coming_soon' && (
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.1em', color: '#2E463D', background: '#2E463D18', padding: '2px 8px' }}>
                即将上线
              </span>
            )}
          </div>
          <h4 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(15px, 2vw, 19px)',
            fontWeight: 700, color: '#1C2220', lineHeight: 1.3, marginBottom: '8px',
          }}>
            {ev.title}
          </h4>
          {ev.date && (
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', letterSpacing: '0.08em' }}>
              {ev.date}
            </p>
          )}
          {/* Expand toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#8FA499', letterSpacing: '0.12em' }}>
              {open ? '收起' : '展开详情'}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8FA499" strokeWidth="1.2"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
              <polyline points="2,4 6,8 10,4"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Accordion detail */}
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="px-4 md:px-8 py-5" style={{ background: '#F9F7F4', borderTop: '1px solid #E6E2DA' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.85, color: 'rgba(28,34,32,0.68)', maxWidth: '60ch', marginBottom: '20px' }}>
            {ev.description}
          </p>
          {ev.reviewUrl && (
            <a href={ev.reviewUrl} style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: '#2E463D', letterSpacing: '0.08em', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              查看活动回顾 →
            </a>
          )}
          {(ev.registerUrl && !ev.comingSoon) && (
            <a href={ev.registerUrl} className="btn-filled" style={{ marginTop: '0', fontSize: '12px', padding: '9px 20px' }}>
              立即报名
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Category card (horizontal scroll) ──
function CategoryCard({ cat, onClick }: { cat: typeof activitiesData.categories[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn-filled"
      style={{
        flexShrink: 0, minWidth: '200px', padding: '0',
        background: 'transparent', color: cat.color,
        border: `1px solid ${cat.color}`,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        textAlign: 'left', overflow: 'hidden', borderRadius: '2px',
        transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = cat.color;
        (e.currentTarget as HTMLButtonElement).style.color = '#fff';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = cat.color;
      }}
    >
      <div style={{ padding: '20px 24px' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>
          {cat.nameEn}
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{cat.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', opacity: 0.7, lineHeight: 1.5 }}>{cat.tagline}</p>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', opacity: 0.5, marginTop: '12px', letterSpacing: '0.06em' }}>
          {(cat as any).comingSoon ? '即将上线' : `${cat.events.length} 期 →`}
        </p>
      </div>
    </button>
  )
}

export default function ActivitiesPage() {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const currentCat = selectedCat ? activitiesData.categories.find(c => c.id === selectedCat) : null

  const TABS = [
    { key: 'upcoming' as Tab, label: '即将举行', en: 'Upcoming' },
    { key: 'all' as Tab, label: '全部活动', en: 'All Events' },
    { key: 'partners' as Tab, label: '友社推荐', en: 'Partners' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>

      {/* Page header — centered */}
      <div className="px-4 md:px-6" style={{ paddingTop: '120px', paddingBottom: '48px', textAlign: 'center', borderBottom: '1px solid #E6E2DA' }}>
        <p className="label-sm" style={{ marginBottom: '16px' }}>Activities · 活动</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 700, letterSpacing: '-0.01em', color: '#1C2220',
        }}>
          我们的活动
        </h1>
      </div>

      {/* Sticky tab bar */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 30,
        background: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E6E2DA',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedCat(null) }}
              className="px-3 md:px-7"
              style={{
                paddingTop: '16px', paddingBottom: '16px',
                fontFamily: 'var(--font-sans)', fontSize: '13px',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #2E463D' : '2px solid transparent',
                color: tab === t.key ? '#2E463D' : '#68736E',
                fontWeight: tab === t.key ? '500' : '400',
                background: 'transparent',
                cursor: 'pointer' as const, whiteSpace: 'nowrap' as const,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {t.label}
              <span className="hidden sm:inline" style={{ marginLeft: '6px', fontSize: '10px', letterSpacing: '0.1em', opacity: 0.45 }}>{t.en}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '56px', paddingBottom: '56px' }}>

        {/* ── UPCOMING TAB ── */}
        {tab === 'upcoming' && (
          <div>
            {activitiesData.upcoming.length === 0 ? (
              <div style={{ padding: '96px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '48px', opacity: 0.15, marginBottom: '16px' }}>🌧️</p>
                <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', fontSize: '14px' }}>敬请期待 · Coming Soon</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {activitiesData.upcoming.map(ev => (
                  <UpcomingBanner key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ALL EVENTS TAB ── */}
        {tab === 'all' && (
          <div>
            {selectedCat && (
              <button
                onClick={() => setSelectedCat(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-label)', fontSize: '12px', color: '#68736E',
                  letterSpacing: '0.08em', marginBottom: '40px', background: 'none', border: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1C2220' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#68736E' }}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ transform: 'rotate(180deg)' }}>
                  <line x1="0" y1="5" x2="12" y2="5"/>
                  <polyline points="8,1 12,5 8,9"/>
                </svg>
                返回全部活动
              </button>
            )}

            {!selectedCat ? (
              <>
                {/* Category horizontal scroll */}
                <p className="label-sm" style={{ marginBottom: '24px', textAlign: 'center' }}>选择分类 · Choose a Category</p>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {activitiesData.categories.map(cat => (
                    <CategoryCard key={cat.id} cat={cat} onClick={() => setSelectedCat(cat.id)} />
                  ))}
                </div>

                {/* Partners — hyperlinks only */}
                <div style={{ marginTop: '72px', paddingTop: '40px', borderTop: '1px solid #E6E2DA', textAlign: 'center' }}>
                  <p className="label-sm" style={{ marginBottom: '24px' }}>Partner Events · 友社推荐</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    {activitiesData.partners.map(p => (
                      <a
                        key={p.id}
                        href={p.url}
                        style={{
                          fontFamily: 'var(--font-serif)', fontSize: '15px', color: '#1C2220',
                          textDecoration: 'underline', textDecorationColor: '#E6E2DA',
                          textUnderlineOffset: '4px', transition: 'all 0.2s',
                          lineHeight: 2,
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLAnchorElement).style.color = '#2E463D';
                          (e.currentTarget as HTMLAnchorElement).style.textDecorationColor = '#2E463D';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLAnchorElement).style.color = '#1C2220';
                          (e.currentTarget as HTMLAnchorElement).style.textDecorationColor = '#E6E2DA';
                        }}
                      >
                        {p.partnerName} · {p.eventName}
                        <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', marginLeft: '12px' }}>{p.date}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : currentCat && (
              <div>
                {/* Category header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <p className="label-sm" style={{ marginBottom: '12px' }}>{currentCat.nameEn}</p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, color: '#1C2220' }}>
                    {currentCat.name}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#68736E', marginTop: '8px' }}>
                    {currentCat.tagline}
                  </p>
                </div>

                {(currentCat as any).comingSoon ? (
                  <div style={{ padding: '80px 0', textAlign: 'center', border: '1px dashed #E6E2DA' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'rgba(28,34,32,0.35)' }}>敬请期待 · Coming Soon</p>
                  </div>
                ) : (
                  /* Full-width event rows with hover dimming */
                  <div className="event-rows" style={{ border: '1px solid #E6E2DA' }}>
                    {currentCat.events.map(ev => (
                      <EventRow key={ev.id} ev={ev} catColor={currentCat.color} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PARTNERS TAB ── */}
        {tab === 'partners' && (
          <div style={{ textAlign: 'center' }}>
            <p className="label-sm" style={{ marginBottom: '40px' }}>Partner Events · 友社推荐</p>
            {activitiesData.partners.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-sans)', color: '#8FA499', padding: '64px 0' }}>暂无友社推荐</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                {activitiesData.partners.map(p => (
                  <div key={p.id} style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '16px 0', borderBottom: '1px solid #E6E2DA' }}>
                    <a
                      href={p.url}
                      style={{
                        fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#1C2220',
                        textDecoration: 'underline', textDecorationColor: '#E6E2DA',
                        textUnderlineOffset: '4px', transition: 'all 0.2s', display: 'block', marginBottom: '6px',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#2E463D'; (e.currentTarget as HTMLAnchorElement).style.textDecorationColor = '#2E463D' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1C2220'; (e.currentTarget as HTMLAnchorElement).style.textDecorationColor = '#E6E2DA' }}
                    >
                      {p.eventName}
                    </a>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', letterSpacing: '0.08em' }}>
                      {p.partnerName} · {p.date}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#68736E', marginTop: '6px' }}>{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
