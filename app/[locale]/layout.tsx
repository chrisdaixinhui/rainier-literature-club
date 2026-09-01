import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import '../globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SubscribeModal from '@/components/SubscribeModal'
import { ModalProvider } from '@/context/ModalContext'
import { getDictionary } from '@/lib/i18n'
import { getMetadataBase } from '@/lib/i18n-metadata'
import { isLocale, locales } from '@/lib/i18n-routing'

const chillHuoSong = localFont({
  src: [
    {
      path: '../fonts/chill-huosong-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/chill-huosong-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/chill-huosong-exbold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-chill-huosong',
})

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)

  return (
    <html
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      className={chillHuoSong.variable}
      data-scroll-behavior="smooth"
    >
      <body className={`locale-${locale}`}>
        <ModalProvider>
          <Nav locale={locale} copy={dictionary.nav} />
          <main>{children}</main>
          <Footer locale={locale} copy={dictionary.footer} sentenceCopy={dictionary.sentence} wechatCopy={dictionary.wechat} />
          <SubscribeModal locale={locale} copy={dictionary.subscribe} />
        </ModalProvider>
      </body>
    </html>
  )
}
