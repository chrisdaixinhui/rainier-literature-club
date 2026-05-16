import FooterClient from './FooterClient'

export default function Footer() {
  return (
    <footer style={{ background: '#FAF8F5', borderTop: '1px solid #E6E2DA' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 24px 0' }}>

        {/* ── Brand + Follow ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 mb-16">

          {/* Brand */}
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: '#1C2220', marginBottom: '4px' }}>
              雨山前
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#68736E', marginBottom: '20px' }}>
              Rainier Literature Society
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#68736E', lineHeight: 1.9, maxWidth: '38ch', marginBottom: '8px' }}>
              在英语世界里，给中文热爱一个栖居之所。
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: 'rgba(104,115,110,0.55)', marginBottom: '16px' }}>
              A home for Chinese literature in Seattle.
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: '#8FA499' }}>
              📍 Seattle, WA
            </p>
          </div>

          {/* Follow */}
          <div>
            <p
              className="label-sm"
              style={{ marginBottom: '20px' }}
            >
              关注我们 · Follow
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Instagram', '小红书', '微信公众号'].map(s => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-muted hover:text-forest transition-all duration-500"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', textDecoration: 'none' }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid #E6E2DA', marginBottom: '64px' }} />

        {/* ── Business Card + Donate ── */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p
            className="label-sm"
            style={{ marginBottom: '28px' }}
          >
            Support Us · 支持我们
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: 'rgba(28,34,32,0.68)',
              lineHeight: 2,
              maxWidth: '52ch',
              margin: '0 auto 32px',
            }}
          >
            如果您也认同这份理想主义，欢迎支持我们（Donate），帮助母语热爱走得更远。
          </p>
          <a
            href="/support#donate"
            className="btn-outline cursor-pointer"
            style={{ color: '#2E463D' }}
          >
            捐赠支持 Donate
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="5" x2="12" y2="5"/>
              <polyline points="8,1 12,5 8,9"/>
            </svg>
          </a>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid #E6E2DA', marginBottom: '64px' }} />

        {/* ── Newsletter — the very last content block ── */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="label-sm" style={{ marginBottom: '16px' }}>每周通讯 · Newsletter</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#68736E', lineHeight: 1.85, marginBottom: '28px' }}>
            活动预告、Quote of the Day、一本书推荐
          </p>
          <FooterClient />
        </div>

        {/* ── Copyright ── */}
        <div style={{ borderTop: '1px solid #E6E2DA', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'rgba(104,115,110,0.5)' }}>
            © {new Date().getFullYear()} 雨山前 Rainier Literature Society
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '11px', color: 'rgba(104,115,110,0.4)' }}>
            Seattle, WA · 雨落苍林
          </p>
        </div>

      </div>
    </footer>
  )
}
