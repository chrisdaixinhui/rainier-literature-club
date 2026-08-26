'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useModal } from '@/context/ModalContext'

const MAX_MOUNTAIN_OFFSET = 40
const POINTER_STRENGTH = 18
const SCROLL_STRENGTH = 40
const MOTION_EASING = 0.12

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

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
  const heroRef = useRef<HTMLElement>(null)
  const landscapeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const landscape = landscapeRef.current
    if (!hero || !landscape) return

    const nav = document.querySelector<HTMLElement>('.site-nav')
    const pointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId: number | null = null
    let pointerEnabled = pointerMedia.matches
    let reducedMotion = motionMedia.matches
    let pointerX = 0
    let pointerY = 0
    let scrollY = 0
    let currentX = 0
    let currentY = 0

    const setPosition = (x: number, y: number) => {
      landscape.style.setProperty('--mountain-x', `${x.toFixed(2)}px`)
      landscape.style.setProperty('--mountain-y', `${y.toFixed(2)}px`)
    }

    const animate = () => {
      frameId = null

      const targetX = clamp(pointerX, -MAX_MOUNTAIN_OFFSET, MAX_MOUNTAIN_OFFSET)
      const targetY = clamp(pointerY + scrollY, -MAX_MOUNTAIN_OFFSET, MAX_MOUNTAIN_OFFSET)
      const nextX = currentX + (targetX - currentX) * MOTION_EASING
      const nextY = currentY + (targetY - currentY) * MOTION_EASING
      const settled = Math.abs(targetX - nextX) < 0.05 && Math.abs(targetY - nextY) < 0.05

      currentX = settled ? targetX : nextX
      currentY = settled ? targetY : nextY
      setPosition(currentX, currentY)

      if (!settled) frameId = window.requestAnimationFrame(animate)
    }

    const requestMotion = () => {
      if (!reducedMotion && frameId === null) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    const updateScroll = () => {
      if (reducedMotion) return

      const bounds = hero.getBoundingClientRect()
      const progress = clamp(-bounds.top / Math.max(1, hero.offsetHeight), 0, 1)
      const nextScrollY = -progress * SCROLL_STRENGTH
      if (Math.abs(nextScrollY - scrollY) < 0.01) return

      scrollY = nextScrollY
      requestMotion()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion || !pointerEnabled) return

      const heroBounds = hero.getBoundingClientRect()
      const navBounds = nav?.getBoundingClientRect()
      const boundsTop = Math.max(0, Math.min(navBounds?.top ?? heroBounds.top, heroBounds.top))
      const boundsBottom = Math.max(navBounds?.bottom ?? boundsTop, heroBounds.bottom)

      if (event.clientY < boundsTop || event.clientY > boundsBottom) {
        resetPointer()
        return
      }

      const normalizedX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1)
      const normalizedY = clamp(((event.clientY - boundsTop) / (boundsBottom - boundsTop)) * 2 - 1, -1, 1)
      pointerX = -normalizedX * POINTER_STRENGTH
      pointerY = -normalizedY * POINTER_STRENGTH
      requestMotion()
    }

    const resetPointer = () => {
      pointerX = 0
      pointerY = 0
      requestMotion()
    }

    const updatePointerMode = () => {
      pointerEnabled = pointerMedia.matches
      if (!pointerEnabled) resetPointer()
    }

    const updateMotionPreference = () => {
      reducedMotion = motionMedia.matches
      if (reducedMotion) {
        if (frameId !== null) window.cancelAnimationFrame(frameId)
        frameId = null
        pointerX = 0
        pointerY = 0
        scrollY = 0
        currentX = 0
        currentY = 0
        setPosition(0, 0)
        return
      }

      updateScroll()
      requestMotion()
    }

    updateMotionPreference()
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', resetPointer)
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    pointerMedia.addEventListener('change', updatePointerMode)
    motionMedia.addEventListener('change', updateMotionPreference)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', resetPointer)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      pointerMedia.removeEventListener('change', updatePointerMode)
      motionMedia.removeEventListener('change', updateMotionPreference)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section
      ref={heroRef}
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
            <div ref={landscapeRef} className="home-hero-landscape">
              <Image
                className="home-hero-background"
                src="/images/hero-mountain-background.png"
                alt=""
                fill
                preload
                sizes="(max-width: 700px) calc(100vw - 36px), 52vw"
              />
              <Image
                className="home-hero-mountain"
                src="/images/hero-mountain-foreground.png"
                alt="蓝色网点印刷风格的山形"
                width={860}
                height={521}
                loading="eager"
                sizes="(max-width: 700px) calc(100vw - 36px), 56vw"
              />
            </div>

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
