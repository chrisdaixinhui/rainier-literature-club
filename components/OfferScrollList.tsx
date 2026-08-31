'use client'

import { useEffect, useRef } from 'react'

interface OfferItem {
  num: string
  title: string
  titleEn: string
  desc: string
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function weightsForProgress(progress: number): [number, number, number] {
  const position = clamp(progress) * 2

  if (position <= 1) return [1 - position, position, 0]

  return [0, 2 - position, position - 1]
}

export default function OfferScrollList({ offers }: { offers: OfferItem[] }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const scene = sceneRef.current
    const list = listRef.current
    const rows = rowRefs.current.filter((row): row is HTMLElement => Boolean(row))
    if (!scene || !list || rows.length !== 3) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileLayout = window.matchMedia('(max-width: 700px)')
    let frame: number | null = null
    let cancelled = false
    let collapsedHeights = [0, 0, 0]
    let expandableHeight = 0

    const clearScrollStyles = () => {
      delete scene.dataset.scrollReady
      list.style.removeProperty('height')
      rows.forEach((row) => {
        row.style.removeProperty('height')
        row.style.removeProperty('--offer-weight')
      })
    }

    const update = () => {
      frame = null
      if (motionPreference.matches) return

      const scrollDistance = Math.max(1, scene.offsetHeight - window.innerHeight)
      const progress = clamp(-scene.getBoundingClientRect().top / scrollDistance)
      const weights = weightsForProgress(progress)

      rows.forEach((row, index) => {
        const weight = weights[index]
        row.style.height = `${collapsedHeights[index] + expandableHeight * weight}px`
        row.style.setProperty('--offer-weight', String(weight))
      })
    }

    const requestUpdate = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(update)
    }

    const measure = () => {
      if (motionPreference.matches) return

      collapsedHeights = rows.map((row) => {
        const number = row.querySelector<HTMLElement>('.home-offer-num')
        const name = row.querySelector<HTMLElement>('.home-offer-name')
        const styles = window.getComputedStyle(row)
        const padding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
        const headingHeight = Math.max(
          number?.getBoundingClientRect().height ?? 0,
          name?.getBoundingClientRect().height ?? 0,
        )

        return Math.ceil(headingHeight + padding)
      })

      const collapsedTotal = collapsedHeights.reduce((sum, height) => sum + height, 0)

      if (mobileLayout.matches) {
        const descriptionHeights = rows.map((row) => {
          const description = row.querySelector<HTMLElement>('.home-offer-desc-clip')
          const rowGap = Number.parseFloat(window.getComputedStyle(row).rowGap) || 0
          return Math.ceil((description?.scrollHeight ?? 0) + rowGap)
        })

        expandableHeight = Math.max(0, ...descriptionHeights)
        list.style.height = `${collapsedTotal + expandableHeight}px`
      } else {
        list.style.removeProperty('height')
        expandableHeight = Math.max(0, list.clientHeight - collapsedTotal)
      }

      update()
    }

    const activateScrollScene = () => {
      if (motionPreference.matches) {
        clearScrollStyles()
        return
      }

      scene.dataset.scrollReady = 'true'
      measure()
    }

    const handleResize = () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }

    activateScrollScene()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', handleResize)
    motionPreference.addEventListener('change', activateScrollScene)
    mobileLayout.addEventListener('change', handleResize)

    void document.fonts?.ready.then(() => {
      if (!cancelled) handleResize()
    })

    return () => {
      cancelled = true
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', handleResize)
      motionPreference.removeEventListener('change', activateScrollScene)
      mobileLayout.removeEventListener('change', handleResize)
      clearScrollStyles()
    }
  }, [])

  return (
    <div ref={sceneRef} className="home-offer-scroll-scene">
      <div className="home-offer-sticky">
        <div className="home-container home-offer-frame">
          <div className="home-section-meta">
            <p>WHAT WE OFFER</p>
            <span>02 / COMMUNITY READING PROGRAMS</span>
          </div>

          <h2 id="home-offers-title" className="home-offers-title">我们提供什么</h2>

          <div ref={listRef} className="home-offer-list">
            {offers.map((offer, index) => (
              <article
                key={offer.num}
                ref={(row) => { rowRefs.current[index] = row }}
                className="home-offer-row"
                data-od-id={`home-offer-${offer.num}`}
              >
                <span className="home-offer-num">{offer.num}</span>
                <div className="home-offer-name">
                  <h3>{offer.title}</h3>
                  <p>{offer.titleEn}</p>
                </div>
                <div className="home-offer-desc-clip">
                  <p className="home-offer-desc">{offer.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <a href="/activities" className="home-text-link">
            <span>查看全部活动</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
