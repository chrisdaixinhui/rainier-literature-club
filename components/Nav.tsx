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
  const { openModal } = useModal()
  const pathname = usePathname()

  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    href === '/' || href === '/#about'
      ? pathname === '/'
      : pathname.startsWith(href.split('#')[0])

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 border-b"
        style={{
          background: 'rgba(250,248,245,0.85)',
          borderColor: 'rgba(230,226,218,0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2.5">
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', fontWeight: 700, letterSpacing: '-0.01em', color: '#1C2220' }}>
            雨山前
          </span>
          <span
            className="hidden sm:block"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#68736E', paddingBottom: '2px' }}
          >
            Rainier Lit
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7 list-none">
            {NAV_LINKS.map(({ href, label, en }) => {
              const active = isActive(href)
              return (
                <li key={`${href}-${en}`}>
                  <Link
                    href={href}
                    className="flex flex-col items-center gap-[3px] group"
                    style={{ textDecoration: 'none' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '14px',
                        color: active ? '#2E463D' : '#1C2220',
                        fontWeight: active ? 600 : 400,
                        transition: 'color 0.5s ease-in-out',
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '8px',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: active ? '#2E463D' : '#8FA499',
                        transition: 'color 0.5s ease-in-out',
                      }}
                    >
                      {en}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Subscribe CTA */}
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 cursor-pointer active:scale-[0.97] active:translate-y-[1px]"
            style={{
              background: '#2E463D',
              color: '#ffffff',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              padding: '8px 18px',
              borderRadius: '4px',
              border: 'none',
              transition: 'all 0.5s ease-in-out',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3a5a4e' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2E463D' }}
          >
            订阅
            <span style={{ opacity: 0.65, fontSize: '10px', letterSpacing: '0.14em' }}>SUBSCRIBE</span>
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
          aria-label="菜单"
        >
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ background: '#1C2220' }} />
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#1C2220' }} />
          <span className={`block w-5 h-px transition-all duration-500 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ background: '#1C2220' }} />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center px-10 gap-10 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: '#FAF8F5' }}
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
            background: '#2E463D', color: '#fff',
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
