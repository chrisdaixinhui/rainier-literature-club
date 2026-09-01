import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SupportClient from '@/components/SupportClient'
import { getActivitiesPayload } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { localizedPageMetadata } from '@/lib/i18n-metadata'
import { isLocale, type Locale } from '@/lib/i18n-routing'
import type { Dictionary } from '@/lib/i18n-types'

async function SupportContent({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const data = await getActivitiesPayload(locale)
  return (
    <SupportClient
      tickets={data.tickets}
      copy={dictionary.support}
      activityLanguageCopy={dictionary.activityLanguage}
    />
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return localizedPageMetadata(locale, 'support')
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)

  return (
    <Suspense fallback={null}>
      <SupportContent locale={locale} dictionary={dictionary} />
    </Suspense>
  )
}
