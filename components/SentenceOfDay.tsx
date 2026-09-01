import { connection } from 'next/server'
import { getLocalizedSentences } from '@/lib/sentences'
import type { Dictionary } from '@/lib/i18n-types'
import type { Locale } from '@/lib/i18n-routing'
import styles from './Footer.module.css'

async function getDailySentence(locale: Locale) {
  await connection()
  const sentences = await getLocalizedSentences(locale)
  if (sentences.length === 0) return null
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return sentences[seed % sentences.length]
}

export default async function SentenceOfDay({
  locale,
  copy,
}: {
  locale: Locale
  copy: Dictionary['sentence']
}) {
  const sentence = await getDailySentence(locale)
  if (!sentence) return null

  return (
    <aside className={styles.dailySentence} aria-labelledby="footer-daily-sentence-title">
      <div>
        <p className={styles.quoteLabel}>{copy.eyebrow}</p>
        <p id="footer-daily-sentence-title" className={styles.quoteLabelChinese}>{copy.title}</p>
      </div>

      <div className={styles.quoteBody}>
        <p className={styles.quoteChinese} lang="zh">{sentence.text}</p>
        {sentence.translation && (
          <p className={styles.quoteEnglish} lang="en">{sentence.translation}</p>
        )}
      </div>

      <div className={styles.quoteCredit}>
        <p>—— {sentence.author}</p>
        <p>{sentence.source}</p>
      </div>
    </aside>
  )
}
