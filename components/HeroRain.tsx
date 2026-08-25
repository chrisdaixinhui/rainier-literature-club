'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@/context/ModalContext'

function ArrowMark() {
  return (
    <span className="home-hero-cta-arrow" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none">
        <path d="M4 9h9M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </span>
  )
}

export default function HeroRain() {
  const { openModal } = useModal()

  return (
    <section
      className="home-hero"
      data-od-id="home-hero"
      aria-labelledby="home-hero-title"
    >
      <div className="home-hero-frame">
        <div className="home-hero-meta">
          <p>Seattle · Chinese Literature Society</p>
          <p><span>47.6062° N</span><span>122.3321° W</span></p>
        </div>

        <div className="home-hero-stage">
          <div className="home-hero-copy">
            <h1 id="home-hero-title" className="home-hero-title">
              <span>在<em>雨山前</em></span>
              <span>重逢<em>中文</em></span>
            </h1>

            <div className="home-hero-intro">
              <p>根植西雅图的中文阅读社群</p>
              <small>在异乡，以阅读、谈话与相聚，让母语继续发生。</small>
            </div>
          </div>

          <div className="home-hero-visual">
            <Image
              className="home-hero-image"
              src="/images/blue-halftone-mountain.png"
              alt="蓝色网点印刷风格的山形"
              fill
              preload
              sizes="(max-width: 700px) calc(100vw - 36px), 52vw"
            />

            <div className="home-hero-rule" aria-hidden="true" />

            <div className="home-hero-actions" data-od-id="home-hero-actions">
              <button
                type="button"
                className="home-hero-cta home-hero-cta-primary"
                data-od-id="home-join-cta"
                onClick={openModal}
              >
                <span>加入我们 · Join Us</span>
                <ArrowMark />
              </button>
              <Link
                href="/activities"
                className="home-hero-cta home-hero-cta-primary"
                data-od-id="home-activities-cta"
              >
                <span>查看活动</span>
                <ArrowMark />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
