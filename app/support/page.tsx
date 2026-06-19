'use client'
import { useState } from 'react'
import activitiesData from '@/data/activities.json'
import DonateSection from '@/components/DonateSection'

const MERCH = [
  { id: 1, num: '01', name: '诗意帆布袋', nameEn: 'Linen Tote Bag', desc: '手提，装书，也装诗意', imgLabel: '帆布袋 · 800×800' },
  { id: 2, num: '02', name: '雾雨书签', nameEn: 'Rain Bookmark', desc: '一枚，一行，一处停留', imgLabel: '书签 · 800×800' },
  { id: 3, num: '03', name: '理想主义者·徽章', nameEn: 'Club Pin', desc: '戴上，就是一种宣言', imgLabel: '徽章 · 800×800' },
  { id: 4, num: '04', name: '社群明信片套装', nameEn: 'Postcard Set', desc: '寄给在英语世界里的你', imgLabel: '明信片 · 800×800' },
]

function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#EAE6DE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8FA499" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
}

function MerchSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const activeMerch = hoveredId ? MERCH.find(m => m.id === hoveredId) : null

  return (
    <section className="px-4 md:px-6" style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '860px', margin: '0 auto' }}>
      <p className="label-sm" style={{ textAlign: 'center', marginBottom: '16px' }}>Merchandise · 周边商品</p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 4vw, 38px)',
        fontWeight: 700, textAlign: 'center', color: '#1C2220', marginBottom: '12px',
      }}>
        周边商品
      </h2>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: '#8FA499', textAlign: 'center', marginBottom: '64px' }}>
        即将上线 · Coming Soon
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-start">

        {/* Left: text list */}
        <div className="merch-list" style={{ paddingTop: '16px' }}>
          {MERCH.map(m => (
            <div
              key={m.id}
              className="merch-item"
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                padding: '20px 0',
                borderBottom: '1px solid #E6E2DA',
                cursor: 'pointer',
                color: hoveredId === m.id ? '#2E463D' : hoveredId !== null ? '#C4C0B8' : '#1C2220',
                transition: 'color 0.25s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '13px',
                  color: hoveredId === m.id ? '#8FA499' : '#C4C0B8',
                  transition: 'color 0.25s', flexShrink: 0,
                }}>
                  {m.num}
                </span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700,
                    lineHeight: 1.2, marginBottom: '4px',
                  }}>
                    {m.name}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: hoveredId === m.id ? '#8FA499' : '#C4C0B8',
                    transition: 'color 0.25s',
                  }}>
                    {m.nameEn}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: hoveredId === m.id ? 'rgba(46,70,61,0.65)' : 'rgba(104,115,110,0.5)',
                    marginTop: '6px', transition: 'color 0.25s',
                  }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8FA499', marginTop: '28px', lineHeight: 1.7 }}>
            订阅通讯，第一时间获知上线消息。
          </p>
        </div>

        {/* Right: floating image (desktop only — hover interaction) */}
        <div className="hidden md:block" style={{ position: 'sticky', top: '100px', aspectRatio: '1/1' }}>
          {MERCH.map(m => (
            <div
              key={m.id}
              style={{
                position: 'absolute', inset: 0,
                opacity: hoveredId === m.id ? 1 : 0,
                transform: hoveredId === m.id ? 'scale(1)' : 'scale(0.97)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                pointerEvents: 'none',
              }}
            >
              <ImgPlaceholder label={m.imgLabel} />
            </div>
          ))}
          {/* Default empty state */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: hoveredId === null ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: '#F2EDE4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: '#C4C0B8' }}>
              hover to preview
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TicketsSection() {
  return (
    <section className="px-4 md:px-6" style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '860px', margin: '0 auto', borderTop: '1px solid #E6E2DA' }}>
      <p className="label-sm" style={{ textAlign: 'center', marginBottom: '16px' }}>Tickets · 活动票务</p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 4vw, 38px)',
        fontWeight: 700, textAlign: 'center', color: '#1C2220', marginBottom: '56px',
      }}>
        活动票务
      </h2>

      {activitiesData.tickets.length === 0 ? (
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#8FA499', padding: '48px 0' }}>
          暂无开放票务，敬请期待。
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {activitiesData.tickets.map(ticket => (
            <div key={ticket.id} style={{ border: '1px solid #E6E2DA' }}>
              {/* Event header */}
              <div style={{ padding: '28px 32px', borderBottom: '1px solid #E6E2DA' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: '#1C2220', marginBottom: '8px' }}>
                  {ticket.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: '#8FA499', letterSpacing: '0.08em' }}>
                  {ticket.date} {ticket.time} · {ticket.location}
                </p>
                {(ticket as any).comingSoon && (
                  <span style={{
                    display: 'inline-block', marginTop: '10px',
                    fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.14em',
                    color: '#2E463D', background: '#2E463D18', padding: '3px 10px',
                  }}>
                    票务即将开放 · COMING SOON
                  </span>
                )}
              </div>

              {/* Two-tier pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* General */}
                <div className="px-8 py-7 border-b border-[#E6E2DA] md:border-b-0 md:border-r md:border-[#E6E2DA]">
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700, color: '#1C2220', marginBottom: '4px' }}>普通票</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: '#8FA499', marginBottom: '20px' }}>General Admission</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#1C2220', marginBottom: '20px' }}>
                    {ticket.generalPrice ? `$${ticket.generalPrice}` : '—'}
                  </p>
                  <a href={ticket.generalUrl} className="btn-outline" style={{ color: '#1C2220', fontSize: '12px', padding: '9px 20px' }}>
                    立即报名
                  </a>
                </div>

                {/* Supporter */}
                <div className="px-8 py-7" style={{ background: '#2E463D08' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700, color: '#1C2220' }}>支持者票</p>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', color: '#2E463D', background: '#2E463D18', padding: '2px 7px', letterSpacing: '0.1em' }}>推荐</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: '#8FA499', marginBottom: '8px' }}>Supporter Ticket</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#68736E', lineHeight: 1.6, marginBottom: '16px' }}>
                    {ticket.supporterPerks}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#2E463D', marginBottom: '20px' }}>
                    {ticket.supporterPrice ? `$${ticket.supporterPrice}` : '—'}
                  </p>
                  <a href={ticket.supporterUrl} className="btn-filled" style={{ fontSize: '12px', padding: '9px 20px' }}>
                    立即报名
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>

      {/* Header */}
      <div className="px-4 md:px-6" style={{ paddingTop: '120px', paddingBottom: '48px', textAlign: 'center', borderBottom: '1px solid #E6E2DA', maxWidth: '680px', margin: '0 auto' }}>
        <p className="label-sm" style={{ marginBottom: '16px' }}>Support Us · 支持我们</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 46px)',
          fontWeight: 700, color: '#1C2220', lineHeight: 1.2, marginBottom: '16px',
        }}>
          支持我们继续做这件事
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '15px', color: '#8FA499' }}>
          Every act of support keeps this community alive.
        </p>
      </div>

      <MerchSection />
      <TicketsSection />
    </div>
  )
}
