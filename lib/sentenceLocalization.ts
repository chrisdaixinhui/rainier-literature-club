import type { Locale } from './i18n-routing'
import type { SentenceRecord } from './sentences'

export function localizeSentences(
  sentences: SentenceRecord[],
  locale: Locale,
): SentenceRecord[] {
  if (locale === 'zh') {
    return sentences.map((sentence) => ({
      ...sentence,
      translation: '',
      authorEn: '',
      sourceEn: '',
    }))
  }

  return sentences.flatMap((sentence) => {
    const hasRequiredCredit = (!sentence.author || sentence.authorEn)
      && (!sentence.source || sentence.sourceEn)
    if (!sentence.translation || !hasRequiredCredit) return []

    return [{
      ...sentence,
      author: sentence.authorEn,
      source: sentence.sourceEn,
      authorEn: '',
      sourceEn: '',
    }]
  })
}
