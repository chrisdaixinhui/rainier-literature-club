import { Suspense } from 'react'
import HeroRain from '@/components/HeroRain'
import OfferScrollList from '@/components/OfferScrollList'
import PhotoWall, { type GalleryPoster } from '@/components/PhotoWall'
import ImageCarousel from '@/components/ImageCarousel'
import UpcomingShowcase from '@/components/UpcomingShowcase'
import { getActivitiesPayload } from '@/lib/content'
import type { ActivitiesPayload } from '@/lib/types'

const OFFERS = [
  {
    num: '01',
    title: '多元共读',
    titleEn: 'Diverse Reading',
    desc: '在西雅图线下举办各类与中文阅读相关的活动，如剧本围读、诗歌拼贴、亲子共读、大咖解读等。我们希望降低阅读门槛，和大家共建属于我们自己的阅读社群。',
  },
  {
    num: '02',
    title: '纯粹体验',
    titleEn: 'Pure Experience',
    desc: '鼓励阅读者注重体会阅读当下的感受和乐趣，抛去"经典"和"必读"的压力，跟随兴趣，简单快乐地阅读。',
  },
  {
    num: '03',
    title: '精神重逢',
    titleEn: 'Kindred Spirits',
    desc: '专为华人打造的知识共享平台，以书会友，与你有相似气味的人相遇及重逢。',
  },
]

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
      }]
    })
}

async function HomeContent() {
  const activities = await getActivitiesPayload()
  const galleryPosters = getGalleryPosters(activities)

  return (
    <div className="home-page" data-od-id="home-page">
      <HeroRain />

      <section
        id="about"
        className="home-about home-section"
        data-od-id="home-about"
        aria-labelledby="home-manifesto-title"
      >
        <div className="home-container">
          <div className="home-section-meta">
            <p>Manifesto + Who We Are · 宣言与我们是谁</p>
            <span>01–02 / COMMON LANGUAGE · ROOTED IN SEATTLE</span>
          </div>

          <div className="home-about-grid">
            <div className="home-manifesto-copy">
              <h2 id="home-manifesto-title" className="home-manifesto-title">
                我们在异乡，<br />用中文重新<br />彼此相认。
                <em>Meet again in Chinese.</em>
              </h2>
            </div>
            <div className="home-about-copy">
              <h3 className="home-about-eyebrow">Who We Are · 我们是谁</h3>
              <p className="home-about-name">Rainier Literature Society</p>
              <p className="home-about-lede">
                我们是雨山前书会，根植于西雅图，是一群热爱中文文学的理想主义者。我们想和你一起，在一个英语母语者的世界，坚持中文热爱，拾起阅读习惯，培养文学兴趣。
              </p>
              <p className="home-about-invitation">我们等待每一个愿意置身于书本世界里的你。</p>
              <p className="home-about-copy-en">
                We are Rainier Literature Society, rooted in Seattle — a community of idealists who love Chinese literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-community home-section"
        data-od-id="home-community"
        aria-label="社群照片与现场记录"
      >
        <div className="home-container">
          <div className="home-carousel-layout" data-od-id="home-community-carousel">
            <div className="home-carousel-caption">
              <span>FIELD NOTES</span>
              <p>阅读发生在人与人之间。雨落下来的时候，我们仍在谈论一本书。</p>
            </div>
            <div className="home-carousel-frame">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-offers home-section"
        data-od-id="home-offers"
        aria-labelledby="home-offers-title"
      >
        <OfferScrollList offers={OFFERS} />
      </section>

      {(activities.upcoming.length > 0 || activities.partners.length > 0) && (
        <UpcomingShowcase activities={activities.upcoming} partners={activities.partners} />
      )}

      <section
        className="event-gallery-section home-gallery-section"
        data-od-id="home-event-gallery"
        aria-labelledby="event-gallery-heading"
      >
        <div className="home-container home-gallery-heading">
          <div>
            <p className="home-gallery-kicker">Past Gatherings · 往期风采集</p>
            <h2 id="event-gallery-heading">把相聚装订成册</h2>
          </div>
        </div>
        <div className="home-gallery-rule" aria-hidden="true" />
        <PhotoWall events={galleryPosters} />
      </section>

    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
