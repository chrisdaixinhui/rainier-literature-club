export const locales = ['zh', 'en'] as const

export type Locale = (typeof locales)[number]

export const DEFAULT_LOCALE: Locale = 'zh'
export const LOCALE_COOKIE = 'rainier_locale'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'zh' || value === 'en'
}

export function preferredLocaleFromHeader(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE

  const supported = header
    .split(',')
    .map((part, index) => {
      const [rawTag, ...parameters] = part.trim().split(';')
      const tag = rawTag.toLowerCase()
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='))
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1
      const quality = Number.isFinite(parsedQuality) ? parsedQuality : 0
      const primary = tag.split('-')[0]
      const locale = primary === 'en' || primary === 'zh' ? primary : null

      return { locale, quality, index }
    })
    .filter((preference): preference is { locale: Locale; quality: number; index: number } => (
      preference.locale !== null && preference.quality > 0
    ))
    .sort((a, b) => b.quality - a.quality || a.index - b.index)

  return supported[0]?.locale ?? DEFAULT_LOCALE
}

export function resolveRootLocale(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  return isLocale(cookieValue) ? cookieValue : preferredLocaleFromHeader(acceptLanguage)
}

export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }

  return pathname || '/'
}

export function externalPathForLocale(pathname: string, locale: Locale): string {
  const basePath = stripLocalePrefix(pathname)
  if (locale === 'zh') return basePath
  return basePath === '/' ? '/en' : `/en${basePath}`
}

export function internalPathForLocale(pathname: string, locale: Locale): string {
  const basePath = stripLocalePrefix(pathname)
  return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`
}

export function localizedHref(
  pathname: string,
  locale: Locale,
  search = '',
  hash = '',
): string {
  const query = search && !search.startsWith('?') ? `?${search}` : search
  const fragment = hash && !hash.startsWith('#') ? `#${hash}` : hash
  return `${externalPathForLocale(pathname, locale)}${query}${fragment}`
}
