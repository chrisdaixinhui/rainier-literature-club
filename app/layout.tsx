import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SubscribeModal from '@/components/SubscribeModal'
import { ModalProvider } from '@/context/ModalContext'

const chillHuoSong = localFont({
  src: [
    {
      path: './fonts/chill-huosong-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/chill-huosong-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/chill-huosong-exbold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-chill-huosong',
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
    <html lang="zh" className={chillHuoSong.variable}>
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
