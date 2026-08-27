'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useModal } from '@/context/ModalContext'

const NAV_LINKS = [
  { href: '/',           label: '首页',   en: 'HOME' },
  { href: '/#about',     label: '关于我们', en: 'ABOUT US' },
  { href: '/activities', label: '活动板块', en: 'EVENTS' },
  { href: '/support',    label: '支持我们', en: 'SUPPORT US' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const { openModal } = useModal()
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/') {
      const timer = setTimeout(() => setHeroVisible(true), 0)
      return () => clearTimeout(timer)
    }

    const hero = document.querySelector<HTMLElement>('[data-od-id="home-hero"]')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      {
        rootMargin: '-92px 0px 0px',
        threshold: 0,
      },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  const isHeroNav = pathname === '/' && heroVisible

  return (
    <>
      <nav
        className={`site-nav flex items-center justify-between border-b ${pathname === '/' ? 'site-nav--home' : ''} ${isHeroNav ? 'site-nav--hero' : ''}`}
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
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="雨山前 Rainier Literature Society 首页">
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

        <div className="hidden md:flex items-center">
          {/* Subscribe CTA */}
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
            订阅
            <span className="site-nav-subscribe-en" style={{ opacity: 0.65, letterSpacing: '0.14em' }}>SUBSCRIBE</span>
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
          aria-label="菜单"
        >
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ background: '#F2EBDF' }} />
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#F2EBDF' }} />
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ background: '#F2EBDF' }} />
        </button>
      </nav>

      {/* Fixed navigation is removed from document flow; keep page content below it. */}
      <div
        aria-hidden="true"
        className={`site-nav-spacer ${pathname === '/' ? 'site-nav-spacer--home' : ''}`}
      />

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center gap-10 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: '#FAF8F5', padding: '96px 40px 40px' }}
      >
        <div className="mb-4 border-b pb-4 w-full" style={{ borderColor: '#E6E2DA' }}>
          <p className="label-sm">Menu · 导航</p>
        </div>
        {NAV_LINKS.map(({ href, label, en }) => (
          <Link
            key={`mobile-${href}-${en}`}
            href={href}
            className="flex items-baseline gap-4"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none' }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 700, color: '#1C2220' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#8FA499', fontSize: '13px', letterSpacing: '0.1em' }}>
              {en}
            </span>
          </Link>
        ))}
        <button
          onClick={() => { openModal(); setMenuOpen(false) }}
          className="cursor-pointer active:scale-[0.97] active:translate-y-[1px]"
          style={{
            background: '#F2EBDF', color: '#1A241E',
            fontFamily: 'var(--font-label)', fontSize: '13px',
            letterSpacing: '0.08em', padding: '12px 28px',
            borderRadius: '4px', border: 'none', marginTop: '8px',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          订阅通讯 SUBSCRIBE
        </button>
      </div>
    </>
  )
}
