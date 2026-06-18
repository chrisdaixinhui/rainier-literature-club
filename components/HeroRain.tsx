'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useModal } from '@/context/ModalContext'

const POEM_LINES = [
  { text: '如果脚步无法抵达，那就从书里开始出发。', delay: 0.4 },
  { text: '如果思绪飘向远方，文字便凝炼成翅膀。', delay: 1.4 },
  { text: null, delay: 0 },
  { text: '我们邀你', delay: 2.6 },
  { text: '栖息雨山前的苍林，成为一棵阅世的树，', delay: 3.4 },
  { text: '晃动枝桠——周围尽是沙沙回响。', delay: 4.2 },
]

export default function HeroRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { openModal } = useModal()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drops = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 8 + Math.random() * 12,
      speed: 0.35 + Math.random() * 0.45,
      opacity: 0.08 + Math.random() * 0.04,
    }))

    function draw() {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drops.forEach(d => {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - 2.5, d.y + d.len)
        ctx.strokeStyle = `rgba(143,164,153,${d.opacity})`
        ctx.lineWidth = 0.7
        ctx.stroke()
        d.y += d.speed
        if (d.y > canvas.height + 20) {
          d.y = -d.len
          d.x = Math.random() * canvas.width
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  const lastDelay = 4.2

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(170deg, #1a2820 0%, #243830 50%, #1a2e24 100%)',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden />

      {/* Centered content */}
      <div
        className="px-4 md:px-10"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          paddingTop: '120px',
          paddingBottom: '80px',
          textAlign: 'center',
        }}
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'rgba(143,164,153,0.5)' }} />
          <span style={{
            fontFamily: 'var(--font-label)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(143,164,153,0.8)',
          }}>
            Seattle · Chinese Literature Society
          </span>
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'rgba(143,164,153,0.5)' }} />
        </motion.div>

        {/* Poem lines */}
        <div style={{ marginBottom: '32px' }}>
          {POEM_LINES.map((line, i) =>
            line.text === null ? (
              <div key={i} style={{ height: '20px' }} />
            ) : (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: line.delay }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(18px, 2.6vw, 26px)',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.9,
                  letterSpacing: '0.02em',
                }}
              >
                {line.text}
              </motion.p>
            )
          )}
        </div>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lastDelay + 0.6, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'rgba(143,164,153,0.85)',
            marginBottom: '52px',
          }}
        >
          —— 坐标西雅图的中文读书会 · 在英语世界里坚持母语热爱
        </motion.p>

        {/* CTA buttons — prominent and clear */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lastDelay + 1.1, duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          {/* Primary: solid white bg */}
          <button
            onClick={openModal}
            style={{
              background: '#ffffff',
              color: '#2E463D',
              fontFamily: 'var(--font-label)',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              padding: '14px 36px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#f0ede8'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            加入我们 · Join Us
          </button>

          {/* Secondary: visible outline */}
          <a
            href="/activities"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-label)',
              fontSize: '13px',
              letterSpacing: '0.06em',
              padding: '13px 28px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.35)',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.14)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.35)'
            }}
          >
            查看活动
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="5" x2="12" y2="5"/>
              <polyline points="8,1 12,5 8,9"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(26,40,32,0.5))',
          pointerEvents: 'none',
        }}
        aria-hidden
      />
    </section>
  )
}
