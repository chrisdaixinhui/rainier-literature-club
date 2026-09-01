import { NextResponse, type NextRequest } from 'next/server'
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  internalPathForLocale,
  resolveRootLocale,
  type Locale,
} from './lib/i18n-routing'

function rememberLocale(response: NextResponse, request: NextRequest, locale: Locale): NextResponse {
  response.cookies.set({
    name: LOCALE_COOKIE,
    value: locale,
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  })
  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const locale = resolveRootLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get('accept-language'),
    )

    if (locale === 'en') {
      const destination = request.nextUrl.clone()
      destination.pathname = '/en'
      return rememberLocale(NextResponse.redirect(destination), request, locale)
    }

    const destination = request.nextUrl.clone()
    destination.pathname = internalPathForLocale(pathname, locale)
    return rememberLocale(NextResponse.rewrite(destination), request, locale)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return rememberLocale(NextResponse.next(), request, 'en')
  }

  const destination = request.nextUrl.clone()
  destination.pathname = internalPathForLocale(pathname, 'zh')
  return rememberLocale(NextResponse.rewrite(destination), request, 'zh')
}

export const config = {
  matcher: ['/', '/activities', '/support', '/en/:path*'],
}
