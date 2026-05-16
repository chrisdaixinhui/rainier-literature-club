import type { Metadata } from 'next'
import { Noto_Serif_SC, Noto_Sans_SC, Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SubscribeModal from '@/components/SubscribeModal'
import { ModalProvider } from '@/context/ModalContext'

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif-sc',
})

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
})

const playfair = Playfair_Display({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '雨山前 · Rainier Literature Society',
  description: '在英语世界里，给中文热爱一个栖居之所。A Seattle Chinese book club rooted in idealism and literature.',
  openGraph: {
    title: '雨山前 · Rainier Literature Society',
    description: '在英语世界里，给中文热爱一个栖居之所。',
    locale: 'zh_CN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      className={`${notoSerifSC.variable} ${notoSansSC.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body>
        <ModalProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <SubscribeModal />
        </ModalProvider>
      </body>
    </html>
  )
}
