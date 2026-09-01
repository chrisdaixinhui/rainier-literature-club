import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeroRain from '@/components/HeroRain'
import OfferScrollList from '@/components/OfferScrollList'
import PhotoWall, { type GalleryPoster } from '@/components/PhotoWall'
import ImageCarousel from '@/components/ImageCarousel'
import UpcomingShowcase from '@/components/UpcomingShowcase'
import { getActivitiesPayload } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { localizedPageMetadata } from '@/lib/i18n-metadata'
import { isLocale, type Locale } from '@/lib/i18n-routing'
import type { Dictionary } from '@/lib/i18n-types'
import type { ActivitiesPayload } from '@/lib/types'

function getGalleryPosters(data: ActivitiesPayload): GalleryPoster[] {
  const seen = new Set<string>()

  return data.categories
    .flatMap((category) => category.events.map((event) => ({
      event,
      categoryName: category.name,
      categoryColor: category.color,
    })))
    .filter(({ event }) => event.status === 'past' && Boolean(event.poster))
    .sort((a, b) => String(b.event.date ?? '').localeCompare(String(a.event.date ?? '')))
    .flatMap(({ event, categoryName, categoryColor }) => {
      const poster = event.poster
      if (!poster || seen.has(poster)) return []
      seen.add(poster)
      return [{
        id: event.id,
        title: event.title,
        date: event.date ?? null,
        poster,
        categoryName,
        categoryColor,
        subType: event.subType,
        description: event.description,
        activityLanguage: event.activityLanguage,
      }]
    })
}

async function HomeContent({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const activities = await getActivitiesPayload(locale)
  const galleryPosters = getGalleryPosters(activities)
  const { home } = dictionary

  return (
    <div className="home-page" data-od-id="home-page">
      <HeroRain locale={locale} copy={home.hero} />

      <section
        id="about"
        className="home-about home-section"
        data-od-id="home-about"
        aria-labelledby="home-manifesto-title"
      >
        <div className="home-container">
          <div className="home-section-meta">
            <p>{home.about.eyebrow}</p>
            <span>{home.about.index}</span>
          </div>

          <div className="home-about-grid">
            <div className="home-manifesto-copy">
              <h2 id="home-manifesto-title" className="home-manifesto-title">
                {home.about.titleLine1}<br />{home.about.titleLine2}<br />{home.about.titleLine3}
                <em>{home.about.titleAccent}</em>
              </h2>
            </div>
            <div className="home-about-copy">
              <h3 className="home-about-heading">
                {home.about.whoTitleLine1}<br />{home.about.whoTitleLine2}
              </h3>
              <p className="home-about-lede">{home.about.lede}</p>
              <p className="home-about-invitation">{home.about.invitation}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-community home-section"
        data-od-id="home-community"
        aria-label={home.community.aria}
      >
        <div className="home-container">
          <div className="home-carousel-layout" data-od-id="home-community-carousel">
            <div className="home-carousel-caption">
              <span>{home.community.eyebrow}</span>
              <p>{home.community.caption}</p>
            </div>
            <div className="home-carousel-frame">
              <ImageCarousel copy={dictionary.carousel} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-offers home-section"
        data-od-id="home-offers"
        aria-labelledby="home-offers-title"
      >
        <OfferScrollList copy={home.offers} activitiesHref={locale === 'en' ? '/en/activities' : '/activities'} />
      </section>

      {(activities.upcoming.length > 0 || activities.partners.length > 0) && (
        <UpcomingShowcase
          activities={activities.upcoming}
          partners={activities.partners}
          copy={home.upcoming}
          activityLanguageCopy={dictionary.activityLanguage}
        />
      )}

      <section
        className="event-gallery-section home-gallery-section"
        data-od-id="home-event-gallery"
        aria-labelledby="event-gallery-heading"
      >
        <div className="home-container home-gallery-heading">
          <div className="home-section-meta">
            <p>{home.gallery.eyebrow}</p>
            <span>{home.gallery.index}</span>
          </div>
          <h2 id="event-gallery-heading">{home.gallery.title}</h2>
        </div>
        <div className="home-gallery-rule" aria-hidden="true" />
        <PhotoWall
          events={galleryPosters}
          copy={home.gallery}
          activityLanguageCopy={dictionary.activityLanguage}
          allowFallback={locale === 'zh'}
        />
      </section>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return localizedPageMetadata(locale, 'home')
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)

  return (
    <Suspense fallback={null}>
      <HomeContent locale={locale} dictionary={dictionary} />
    </Suspense>
  )
}
