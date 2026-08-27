import Link from 'next/link'
import { Suspense } from 'react'
import FooterYear from './FooterYear'
import SentenceOfDay from './SentenceOfDay'
import WechatAssistantButton from './WechatAssistantButton'
import styles from './Footer.module.css'

const MENU_LINKS = [
  { label: '首页', href: '/' },
  { label: '关于我们', href: '/#about' },
  { label: '全部活动', href: '/activities' },
  { label: '支持我们', href: '/support' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    handle: '@yushanqianseattle',
    href: 'https://www.instagram.com/yushanqianseattle/',
  },
  {
    label: '小红书',
    handle: '@雨山前 The Rainier',
    href: 'https://www.xiaohongshu.com/user/profile/5d46a7c00000000011008a5e?xsec_token=ABNpxUtCE37whEhdNvzMjLz8oS2yhGLRBBEW-N0PY9pJY%3D&xsec_source=pc_search',
  },
  {
    label: '微信公众号',
    handle: '雨山前 Rainier Literature Society',
    href: 'https://weixin.qq.com/r/mp/OxJLU-DEkK3vrbQw90cp',
  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.primary}>
          <div className={styles.information}>
            <div className={styles.brand}>
              <p className={styles.brandName}>雨山前</p>
              <p className={styles.brandEnglish}>Rainier Literature Society</p>
              <p className={styles.tagline}>在英语世界里，给中文热爱一个栖居之所。</p>
              <p className={styles.taglineEnglish}>A home for Chinese literature in Seattle.</p>
              <p className={styles.location}>📍 Seattle, WA</p>
            </div>

            <nav className={styles.menu} aria-label="页尾导航">
              <p className="label-sm">Menu · 导航</p>
              <ul className={styles.linkList}>
                {MENU_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.social}>
              <p className="label-sm">关注我们 · Follow</p>
              <ul className={styles.socialList}>
                {SOCIAL_LINKS.map(({ label, handle, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} ${handle}`}
                    >
                      <span>{label}</span>
                      <small>{handle}</small>
                    </a>
                  </li>
                ))}
              </ul>
              <WechatAssistantButton />
            </div>
          </div>

          <Suspense fallback={null}>
            <SentenceOfDay />
          </Suspense>
        </div>

        <div className={styles.copyright}>
          <p>© <FooterYear /> 雨山前 Rainier Literature Society</p>
          <p>Seattle, WA · 雨落苍林</p>
        </div>
      </div>
    </footer>
  )
}
