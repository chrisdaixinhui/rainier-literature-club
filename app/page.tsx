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
    desc: '我们把阅读做成许多种形状：围读一出戏，让角色借每个人的声音重新活起来；剪下一句诗，在纸上拼出意外的相遇；和伙伴共读，也邀请熟悉某个领域的人，把一扇原本陌生的门推开。你不必读完一本书，也不必提前准备标准答案。入口很多，路径也不相同。只要有一点好奇，就可以从喜欢的地方进来，和我们一起把阅读变成一件有人回应的事。',
  },
  {
    num: '02',
    title: '纯粹体验',
    titleEn: 'Pure Experience',
    desc: '我们对“应该读什么”没有很大兴趣。经典不需要被供在高处，必读书目也不该变成另一种绩效。我们更想知道：哪一句让你沉默，哪一页让你想起自己的生活，哪一个人物使你不舒服，却又忍不住多看一会儿？有些书第一次读只留下困惑，几年后才忽然回来。阅读的乐趣常常就藏在这种不确定里。你不必证明自己懂了，只要诚实地说出此刻看见了什么。',
  },
  {
    num: '03',
    title: '精神重逢',
    titleEn: 'Kindred Spirits',
    desc: '知识在这里不是用来证明谁更懂，而是用来交换。一个人带来书里的概念，另一个人带来工作、家庭或迁徙中的经验，还有人只带来一个没想完的问题；它们放到同一张桌上，往往会打开新的方向。我们相信好的谈话不急着分出输赢，而是让原本彼此陌生的生活短暂相连。一本书可以成为起点，但真正让社群继续生长的，是愿意分享的人，也是愿意认真听的人。',
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
        className="home-manifesto home-section"
        data-od-id="home-manifesto"
        aria-labelledby="home-manifesto-title"
      >
        <div className="home-container">
          <div className="home-section-meta">
            <p>Manifesto · 宣言</p>
            <span>01 / COMMON LANGUAGE</span>
          </div>
          <h2 id="home-manifesto-title" className="home-manifesto-title">
            我们在异乡，<br />用中文重新彼此相认。<em>A city apart. A book between us.</em>
          </h2>
        </div>
      </section>

      <section
        id="about"
        className="home-about home-section"
        data-od-id="home-about"
        aria-labelledby="home-about-title"
      >
        <div className="home-container">
          <div className="home-section-meta">
            <p>Who We Are · 我们是谁</p>
            <span>02 / ROOTED IN SEATTLE</span>
          </div>

          <div className="home-about-grid">
            <div className="home-about-heading">
              <h2 id="home-about-title">我们是谁</h2>
              <p>Rainier Literature Society</p>
            </div>
            <div className="home-about-copy">
              <p>
                这座城市很擅长让人高效地生活，却不一定给人留下完整地说一句话的时间。于是我们办了雨山前：把中文、文学和彼此的注意力放回同一个空间。我们不负责定义什么是好读者，只认真对待每一次真实的阅读与回应。
              </p>
              <p>你不必先准备好观点。带着一个还没想清楚的问题来，就很好。</p>
              <p className="home-about-copy-en">
                We are Rainier Literature Society, rooted in Seattle — a community of idealists who love Chinese literature.
              </p>
            </div>
          </div>

          <div className="home-carousel-layout" data-od-id="home-community-carousel">
            <div className="home-carousel-caption">
              <span>FIELD NOTES</span>
              <p>有人朗读，有人走神，有人突然说起很远以前的事。照片只留住一秒，谈话还在继续。</p>
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
