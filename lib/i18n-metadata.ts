import 'server-only'

import type { Metadata } from 'next'
import { getDictionary } from './i18n'
import { externalPathForLocale, type Locale } from './i18n-routing'

export type LocalizedPage = 'home' | 'activities' | 'support'

function pagePath(page: LocalizedPage): string {
  return page === 'home' ? '/' : `/${page}`
}

export function getMetadataBase(): URL {
  const configured = process.env.SITE_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')

  return new URL(configured)
}

export function localizedPageMetadata(locale: Locale, page: LocalizedPage): Metadata {
  const dictionary = getDictionary(locale)
  const copy = dictionary.meta[page]
  const basePath = pagePath(page)
  const canonical = externalPathForLocale(basePath, locale)
  const chinese = externalPathForLocale(basePath, 'zh')
  const english = externalPathForLocale(basePath, 'en')

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': chinese,
        'en-US': english,
        'x-default': chinese,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      siteName: '雨山前 Rainier Literature Society',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
      type: 'website',
    },
  }
}
