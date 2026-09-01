import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ActivitiesClient from '@/components/ActivitiesClient'
import { getActivitiesPayload } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { localizedPageMetadata } from '@/lib/i18n-metadata'
import { isLocale, type Locale } from '@/lib/i18n-routing'
import type { Dictionary } from '@/lib/i18n-types'

async function ActivitiesContent({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const data = await getActivitiesPayload(locale)
  return (
    <ActivitiesClient
      initialData={data}
      copy={dictionary.activities}
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
  return localizedPageMetadata(locale, 'activities')
}

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)

  return (
    <Suspense fallback={null}>
      <ActivitiesContent locale={locale} dictionary={dictionary} />
    </Suspense>
  )
}
