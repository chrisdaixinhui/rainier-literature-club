import HeroRain from '@/components/HeroRain'
import SentenceOfDay from '@/components/SentenceOfDay'
import PhotoWall from '@/components/PhotoWall'

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

function ImgPlaceholder({ label, aspect }: { label: string; aspect?: string }) {
  return (
    <div
      className={`w-full ${aspect ?? 'aspect-[4/3]'} flex flex-col items-center justify-center gap-2`}
      style={{ background: '#E8E3DA', border: '1px solid #E6E2DA' }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FA499" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#8FA499', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <HeroRain />

      {/* ── WHO WE ARE ── centered layout */}
      <section id="about" style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p className="label-sm" style={{ marginBottom: '20px' }}>Who We Are · 我们是谁</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(30px, 5vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: '#1C2220',
              marginBottom: '36px',
            }}
          >
            我们是谁
          </h2>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: 1.9, color: 'rgba(28,34,32,0.72)', marginBottom: '20px' }}>
            我们是雨山前书会，根植于西雅图，是一群热爱中文文学的理想主义者。我们想和你一起，在一个英语母语者的世界，坚持中文热爱，拾起阅读习惯，培养文学兴趣。
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: 1.9, color: 'rgba(28,34,32,0.72)', marginBottom: '32px' }}>
            我们等待每一个愿意置身于书本世界里的你。
          </p>

          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '15px', color: '#68736E', lineHeight: 1.8 }}>
            We are Rainier Literature Society, rooted in Seattle — a community of idealists who love Chinese literature.
          </p>
        </div>

        {/* Photo — centered full-width banner */}
        <div style={{ maxWidth: '900px', margin: '64px auto 0' }}>
          <ImgPlaceholder label="社群合影 · 900 × 500" aspect="aspect-[16/9] md:aspect-[21/9]" />
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: '1px solid #E6E2DA', margin: '0 24px' }} />

      {/* ── PULL QUOTE ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: '#F2EDE4' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <p
            className="pull-quote"
            style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: 'rgba(28,34,32,0.7)' }}
          >
            "大千世界里的芸芸众生，<br />都是自己故事里的主角。"
          </p>
          <p className="label-sm" style={{ marginTop: '28px' }}>雨山前书会 · Seattle</p>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── centered, typography-driven */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="label-sm" style={{ marginBottom: '20px' }}>What We Offer · 我们提供什么</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              color: '#1C2220',
              marginBottom: '64px',
            }}
          >
            我们提供什么
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px 32px' }}>
            {OFFERS.map((o) => (
              <div key={o.num} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#E6E2DA',
                    lineHeight: 1,
                    marginBottom: '20px',
                  }}
                >
                  {o.num}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: '#1C2220', marginBottom: '6px' }}>
                  {o.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA499', marginBottom: '16px' }}>
                  {o.titleEn}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.85, color: 'rgba(28,34,32,0.62)' }}>
                  {o.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '48px' }}>
            <a
              href="/activities"
              className="btn-outline"
              style={{ color: '#2E463D' }}
            >
              查看全部活动
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="0" y1="5" x2="12" y2="5"/>
                <polyline points="8,1 12,5 8,9"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── PHOTO WALL ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <p className="label-sm" style={{ textAlign: 'center', marginBottom: '40px' }}>往期风采集 · Event Gallery</p>
        <PhotoWall />
      </section>

      {/* ── SENTENCE OF THE DAY ── */}
      <SentenceOfDay />
    </>
  )
}
