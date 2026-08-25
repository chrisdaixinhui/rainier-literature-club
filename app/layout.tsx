import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SubscribeModal from '@/components/SubscribeModal'
import { ModalProvider } from '@/context/ModalContext'

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
    <html lang="zh">
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
