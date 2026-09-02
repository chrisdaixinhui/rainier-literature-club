'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useModal } from '@/context/ModalContext'
import LanguageSwitcher from './LanguageSwitcher'
import { externalPathForLocale, stripLocalePrefix, type Locale } from '@/lib/i18n-routing'
import type { Dictionary } from '@/lib/i18n-types'

const ENGLISH_ACCENTS = ['HOME', 'ABOUT US', 'EVENTS', 'SUPPORT US']

export default function Nav({
  locale,
  copy,
}: {
  locale: Locale
  copy: Dictionary['nav']
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const { openModal } = useModal()
  const pathname = usePathname()
  const isHome = stripLocalePrefix(pathname) === '/'
  const homeHref = externalPathForLocale('/', locale)
  const navLinks = [
    { href: homeHref, label: copy.links.home },
    { href: `${homeHref}#about`, label: copy.links.about },
    { href: externalPathForLocale('/activities', locale), label: copy.links.activities },
    { href: externalPathForLocale('/support', locale), label: copy.links.support },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!isHome) {
      const timer = setTimeout(() => setHeroVisible(true), 0)
      return () => clearTimeout(timer)
    }

    let observer: IntersectionObserver | null = null
    let mutationObserver: MutationObserver | null = null

    const attach = (hero: HTMLElement) => {
      observer = new IntersectionObserver(
        ([entry]) => setHeroVisible(entry.isIntersecting),
        { rootMargin: '-92px 0px 0px', threshold: 0 },
      )
      observer.observe(hero)
    }

    const existingHero = document.querySelector<HTMLElement>('[data-od-id="home-hero"]')
    if (existingHero) {
      attach(existingHero)
    } else {
      mutationObserver = new MutationObserver(() => {
        const hero = document.querySelector<HTMLElement>('[data-od-id="home-hero"]')
        if (hero) {
          mutationObserver?.disconnect()
          mutationObserver = null
          attach(hero)
        }
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      observer?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [isHome])

  const isHeroNav = isHome && heroVisible

  return (
    <>
      <nav
        className={`site-nav flex items-center justify-between border-b ${isHome ? 'site-nav--home' : ''} ${isHeroNav ? 'site-nav--hero' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#1A241E',
          borderColor: '#1A241E',
        }}
      >
        <Link href={homeHref} className="site-nav-logo flex items-center" aria-label={copy.homeAria}>
          <span
            className="site-nav-logo-mark"
            aria-hidden="true"
            style={{
              background: '#F2EBDF',
              maskImage: "url('/rainier-logo-horizontal-black.png')",
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
              maskSize: 'contain',
              WebkitMaskImage: "url('/rainier-logo-horizontal-black.png')",
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
            }}
          />
        </Link>

        <div className="site-nav-actions site-nav-actions--desktop hidden md:flex items-center">
          <LanguageSwitcher locale={locale} ariaLabel={copy.languageSwitcherAria} />
          <button
            onClick={openModal}
            className="site-nav-subscribe flex items-center cursor-pointer active:scale-[0.97] active:translate-y-[1px]"
            style={{
              background: '#F2EBDF',
              color: '#1A241E',
              fontFamily: 'var(--font-label)',
              letterSpacing: '0.08em',
              border: 'none',
              transition: 'all 0.5s ease-in-out',
            }}
          >
            {copy.subscribe}
            {copy.subscribeAccent && (
              <span className="site-nav-subscribe-en" style={{ opacity: 0.65, letterSpacing: '0.14em' }}>
                {copy.subscribeAccent}
              </span>
            )}
          </button>
        </div>

        <div className="site-nav-actions site-nav-actions--mobile md:hidden">
          <LanguageSwitcher locale={locale} ariaLabel={copy.languageSwitcherAria} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="site-nav-hamburger flex flex-col gap-[5px] cursor-pointer"
            aria-label={menuOpen ? copy.menuClose : copy.menuButton}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
          >
            <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ background: '#F2EBDF' }} />
            <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#F2EBDF' }} />
            <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ background: '#F2EBDF' }} />
          </button>
        </div>
      </nav>

      <div
        aria-hidden="true"
        className={`site-nav-spacer ${isHome ? 'site-nav-spacer--home' : ''}`}
      />

      <div
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center gap-10 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: '#FAF8F5', padding: '96px 40px 40px' }}
      >
        <div className="mb-4 border-b pb-4 w-full" style={{ borderColor: '#E6E2DA' }}>
          <p className="label-sm">{copy.menuEyebrow}</p>
        </div>
        {navLinks.map(({ href, label }, index) => (
          <Link
            key={`mobile-${href}`}
            href={href}
            className="flex items-baseline gap-4"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none' }}
            tabIndex={menuOpen ? undefined : -1}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 700, color: '#1C2220' }}>
              {label}
            </span>
            {locale === 'zh' && (
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#8FA499', fontSize: '13px', letterSpacing: '0.1em' }}>
                {ENGLISH_ACCENTS[index]}
              </span>
            )}
          </Link>
        ))}
        <button
          onClick={() => { openModal(); setMenuOpen(false) }}
          className="cursor-pointer active:scale-[0.97] active:translate-y-[1px]"
          tabIndex={menuOpen ? undefined : -1}
          style={{
            background: '#F2EBDF', color: '#1A241E',
            fontFamily: 'var(--font-label)', fontSize: '13px',
            letterSpacing: '0.08em', padding: '12px 28px',
            borderRadius: '4px', border: 'none', marginTop: '8px',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          {copy.subscribeFull}
        </button>
      </div>
    </>
  )
}
