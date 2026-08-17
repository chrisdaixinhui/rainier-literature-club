'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useModal } from '@/context/ModalContext'

const POEM_LINES = [
  '如果脚步无法抵达，那就从书里开始出发。',
  '如果思绪飘向远方，文字便凝炼成翅膀。',
  '',
  '我们邀你',
  '栖息雨山前的苍林，成为一棵阅世的树，',
  '晃动枝桠——周围尽是沙沙回响。',
]

export default function HeroRain() {
  const heroRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const { openModal } = useModal()

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    let frame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      frame = 0
      if (reducedMotion) {
        setProgress(1)
        return
      }

      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1)
      setProgress(Math.min(Math.max(window.scrollY / travel, 0), 1))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const eased = 1 - Math.pow(1 - progress, 3)
  const copyY = 31 - eased * 72
  const copyOpacity = Math.min(Math.max((progress - 0.08) / 0.42, 0), 1)
  const detailsOpacity = Math.min(Math.max((progress - 0.32) / 0.45, 0), 1)

  return (
    <section ref={heroRef} className="hero-scroll-scene">
      <div className="hero-sticky-frame">
        <div
          className="hero-rising-copy"
          style={{
            opacity: copyOpacity,
            transform: `translate3d(-50%, ${copyY}vh, 0)`,
          }}
        >
          <p className="hero-eyebrow">Seattle · Chinese Literature Society</p>

          <div className="hero-poem">
            {POEM_LINES.map((line, index) =>
              line ? <p key={line}>{line}</p> : <div key={`space-${index}`} aria-hidden />
            )}
          </div>

          <p className="hero-attribution">
            —— 坐标西雅图的中文读书会 · 在英语世界里坚持母语热爱
          </p>

          <div
            className="hero-actions"
            style={{
              opacity: detailsOpacity,
              transform: `translateY(${(1 - detailsOpacity) * 14}px)`,
            }}
          >
            <button onClick={openModal} className="hero-primary-action">
              加入我们 · Join Us
            </button>
            <a href="/activities" className="hero-secondary-action">
              查看活动
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <line x1="0" y1="5" x2="12" y2="5" />
                <polyline points="8,1 12,5 8,9" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-cover-media hero-cover-media-foreground">
          <Image
            src="/hero-rainier-mountain.png"
            alt="雷尼尔山"
            width={2970}
            height={660}
            fetchPriority="high"
            sizes="(max-width: 767px) 190vw, 100vw"
            unoptimized
            className="hero-cover-mountain"
          />
        </div>

        <div className="hero-scroll-cue" style={{ opacity: 1 - Math.min(progress * 5, 1) }} aria-hidden>
          <span>向下滚动</span>
          <i />
        </div>
      </div>
    </section>
  )
}
