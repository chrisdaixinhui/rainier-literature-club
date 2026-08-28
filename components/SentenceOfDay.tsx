import { connection } from 'next/server'
import { getSentences } from '@/lib/sentences'
import styles from './Footer.module.css'

async function getDailySentence() {
  await connection()
  const sentences = await getSentences()
  if (sentences.length === 0) return null
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return sentences[seed % sentences.length]
}

export default async function SentenceOfDay() {
  const sentence = await getDailySentence()
  if (!sentence) return null

  return (
    <aside className={styles.dailySentence} aria-labelledby="footer-daily-sentence-title">
      <div>
        <p className={styles.quoteLabel}>Quote of the Day</p>
        <p id="footer-daily-sentence-title" className={styles.quoteLabelChinese}>每日一句</p>
      </div>

      <div className={styles.quoteBody}>
        <p className={styles.quoteChinese}>{sentence.text}</p>
        {sentence.translation && (
          <p className={styles.quoteEnglish}>{sentence.translation}</p>
        )}
      </div>

      <div className={styles.quoteCredit}>
        <p>—— {sentence.author}</p>
        <p>{sentence.source}</p>
      </div>
    </aside>
  )
}
