import Link from 'next/link'
import { Suspense } from 'react'
import FooterYear from './FooterYear'
import SentenceOfDay from './SentenceOfDay'
import WechatAssistantButton from './WechatAssistantButton'
import styles from './Footer.module.css'
import type { Dictionary } from '@/lib/i18n-types'
import { externalPathForLocale, type Locale } from '@/lib/i18n-routing'

const SOCIAL_LINKS = [
  {
    label: { zh: 'Instagram', en: 'Instagram' },
    handle: '@yushanqianseattle',
    href: 'https://www.instagram.com/yushanqianseattle/',
  },
  {
    label: { zh: '小红书', en: 'Xiaohongshu' },
    handle: '@雨山前 The Rainier',
    href: 'https://www.xiaohongshu.com/user/profile/5d46a7c00000000011008a5e?xsec_token=ABNpxUtCE37whEhdNvzMjLz8oS2yhGLRBBEW-N0PY9pJY%3D&xsec_source=pc_search',
  },
  {
    label: { zh: '微信公众号', en: 'WeChat Official Account' },
    handle: '雨山前 Rainier Literature Society',
    href: 'https://weixin.qq.com/r/mp/OxJLU-DEkK3vrbQw90cp',
  },
]

export default function Footer({
  locale,
  copy,
  sentenceCopy,
  wechatCopy,
}: {
  locale: Locale
  copy: Dictionary['footer']
  sentenceCopy: Dictionary['sentence']
  wechatCopy: Dictionary['wechat']
}) {
  const homeHref = externalPathForLocale('/', locale)
  const menuLinks = [
    { label: copy.links.home, href: homeHref },
    { label: copy.links.about, href: `${homeHref}#about` },
    { label: copy.links.activities, href: externalPathForLocale('/activities', locale) },
    { label: copy.links.support, href: externalPathForLocale('/support', locale) },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.primary}>
          <div className={styles.information}>
            <div className={styles.brand}>
              <p className={styles.brandName}>雨山前</p>
              <p className={styles.brandEnglish}>Rainier Literature Society</p>
              <p className={styles.tagline}>{copy.tagline}</p>
              <p className={styles.taglineEnglish}>{copy.taglineAccent}</p>
              <p className={styles.location}>📍 Seattle, WA</p>
            </div>

            <nav className={styles.menu} aria-label={copy.menuAria}>
              <p className="label-sm">{copy.menuEyebrow}</p>
              <ul className={styles.linkList}>
                {menuLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.social}>
              <p className="label-sm">{copy.followEyebrow}</p>
              <ul className={styles.socialList}>
                {SOCIAL_LINKS.map(({ label, handle, href }) => (
                  <li key={label.en}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label[locale]} ${handle}`}
                    >
                      <span>{label[locale]}</span>
                      <small>{handle}</small>
                    </a>
                  </li>
                ))}
              </ul>
              <WechatAssistantButton copy={wechatCopy} />
            </div>
          </div>

          <Suspense fallback={null}>
            <SentenceOfDay locale={locale} copy={sentenceCopy} />
          </Suspense>
        </div>

        <div className={styles.copyright}>
          <p>© <FooterYear /> 雨山前 Rainier Literature Society</p>
          <p>{copy.copyrightAccent}</p>
        </div>
      </div>
    </footer>
  )
}
