'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { ActivityRecord } from '@/lib/types'

function hasUsableUrl(url?: string | null): url is string {
  return Boolean(url && url.trim() && url.trim() !== '#')
}

function activityMeta(activity: ActivityRecord): string {
  const schedule = [activity.date, activity.time].filter(Boolean).join(' ')
  const place = [activity.location, activity.locationDetail].filter(Boolean).join(' · ')
  return [schedule || '时间待公布', place || '地点待公布'].join(' · ')
}

const CARD_SCROLL_PHASES = 3

function cardMotion(progress: number, index: number, total: number) {
  const phase = progress * total * CARD_SCROLL_PHASES - index * CARD_SCROLL_PHASES

  if (phase <= 0) return { phase, x: 112, opacity: 0, scale: 0.96 }
  if (phase < 1) {
    const eased = 1 - (1 - phase) ** 3
    return {
      phase,
      x: 112 * (1 - eased),
      opacity: Math.min(1, phase * 4),
      scale: 0.96 + eased * 0.04,
    }
  }
  if (phase <= 2) return { phase, x: 0, opacity: 1, scale: 1 }
  if (phase < 3) {
    const exit = phase - 2
    return {
      phase,
      x: -112 * exit ** 3,
      opacity: Math.min(1, (1 - exit) * 4),
      scale: 1 - exit * 0.04,
    }
  }

  return { phase, x: -112, opacity: 0, scale: 0.96 }
}

export default function UpcomingShowcase({ activities }: { activities: ActivityRecord[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [gridProgress, setGridProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const update = () => {
      frameRef.current = null
      const section = sectionRef.current
      if (!section) return

      const bounds = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollRange = Math.max(1, section.offsetHeight - viewportHeight)
      setProgress(Math.max(0, Math.min(1, -bounds.top / scrollRange)))
      setGridProgress(Math.max(0, Math.min(1, (viewportHeight - bounds.top) / viewportHeight)))
    }

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  if (activities.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="home-upcoming-section"
      style={{
        '--home-upcoming-steps': activities.length * CARD_SCROLL_PHASES + 1,
        '--home-upcoming-grid-progress': gridProgress,
      } as CSSProperties}
      aria-labelledby="home-upcoming-title"
      data-od-id="home-upcoming"
    >
      <div className="home-upcoming-sticky">
        <div className="home-upcoming-grid" aria-hidden="true">
          <span className="home-upcoming-grid-layer home-upcoming-grid-horizontal home-upcoming-grid-from-left" />
          <span className="home-upcoming-grid-layer home-upcoming-grid-horizontal home-upcoming-grid-from-right" />
          <span className="home-upcoming-grid-layer home-upcoming-grid-vertical home-upcoming-grid-from-top" />
          <span className="home-upcoming-grid-layer home-upcoming-grid-vertical home-upcoming-grid-from-bottom" />
        </div>

        <header className="home-upcoming-heading">
          <p>What’s coming…</p>
          <h2 id="home-upcoming-title">敬请期待</h2>
        </header>

        <div className="home-upcoming-deck">
          {activities.map((activity, index) => {
            const motion = cardMotion(progress, index, activities.length)
            const canInteract = reducedMotion || (motion.phase > 0.55 && motion.phase < 2.45)
            const registrationUrl = hasUsableUrl(activity.registerUrl) ? activity.registerUrl : null

            return (
              <article
                key={activity.id}
                className="home-upcoming-card"
                style={{
                  opacity: motion.opacity,
                  pointerEvents: canInteract ? 'auto' : 'none',
                  transform: `translate3d(calc(-50% + ${motion.x}vw), 0, 0) scale(${motion.scale})`,
                  zIndex: Math.round(100 - Math.abs(1 - motion.phase) * 10),
                }}
                aria-hidden={!canInteract}
                inert={!canInteract}
              >
                <div className="home-upcoming-poster">
                  {activity.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activity.poster} alt={`${activity.title} 活动海报`} />
                  ) : (
                    <div className="home-upcoming-poster-placeholder" aria-hidden="true">
                      <span>Rainier Literature Society</span>
                      <strong>雨山前</strong>
                    </div>
                  )}
                </div>

                <div className="home-upcoming-copy">
                  <p className="home-upcoming-count">
                    {String(index + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}
                  </p>
                  <div>
                    <h3>{activity.title}</h3>
                    {activity.titleEn && <p className="home-upcoming-title-en">{activity.titleEn}</p>}
                    <p className="home-upcoming-meta">{activityMeta(activity)}</p>
                  </div>
                  {activity.description && <p className="home-upcoming-description">{activity.description}</p>}
                  {registrationUrl ? (
                    <a className="home-upcoming-action" href={registrationUrl} target="_blank" rel="noreferrer">
                      <span>报名活动 · Register</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="home-upcoming-action is-disabled" aria-disabled="true">
                      <span>报名即将开放</span>
                      <span aria-hidden="true">···</span>
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="home-upcoming-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  )
}
