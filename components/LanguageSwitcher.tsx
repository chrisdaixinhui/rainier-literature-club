'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  localizedHref,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from '@/lib/i18n-routing'

export default function LanguageSwitcher({
  locale,
  ariaLabel,
}: {
  locale: Locale
  ariaLabel: string
}) {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [hash, setHash] = useState('')

  const rememberLocale = (nextLocale: Locale) => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
  }

  useEffect(() => {
    const updateLocation = () => {
      setSearch(window.location.search)
      setHash(window.location.hash)
    }
    updateLocation()
    window.addEventListener('hashchange', updateLocation)
    window.addEventListener('popstate', updateLocation)
    return () => {
      window.removeEventListener('hashchange', updateLocation)
      window.removeEventListener('popstate', updateLocation)
    }
  }, [])

  return (
    <div className="site-language-switcher" role="group" aria-label={ariaLabel}>
      {locale === 'zh' ? (
        <span className="site-language-option is-current" aria-current="page" aria-label="中文">
          中
        </span>
      ) : (
        <Link
          href={localizedHref(pathname, 'zh', search, hash)}
          className="site-language-option"
          aria-label="中文"
          prefetch={false}
          onClick={() => rememberLocale('zh')}
        >
          中
        </Link>
      )}

      <span className="site-language-separator" aria-hidden="true">/</span>

      {locale === 'en' ? (
        <span className="site-language-option is-current" aria-current="page" aria-label="English">
          EN
        </span>
      ) : (
        <Link
          href={localizedHref(pathname, 'en', search, hash)}
          className="site-language-option"
          aria-label="English"
          prefetch={false}
          onClick={() => rememberLocale('en')}
        >
          EN
        </Link>
      )}
    </div>
  )
}
