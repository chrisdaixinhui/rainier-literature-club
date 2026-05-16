'use client'

const EVENTS = [
  { id: 0, label: '重建社群 · Vol.1', sub: 'Jan 2026' },
  { id: 1, label: '红楼梦共读', sub: 'Apr 2026' },
  { id: 2, label: 'YSQ Talk Vol.1', sub: 'Nov 2025' },
  { id: 3, label: '乱讲PPT之夜', sub: 'Mar 2026' },
  { id: 4, label: '桌游社交夜', sub: 'Feb 2026' },
  { id: 5, label: 'YSQ Talk Vol.2', sub: 'Mar 2026' },
  { id: 6, label: '线上阅读 · 四月', sub: 'Apr 2026' },
  { id: 7, label: '马克思主题共读', sub: 'May 2026' },
]

const ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -2, 1.3, -2.2, 1.6]

export default function PhotoWall() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {EVENTS.map((ev, i) => {
        const rot = ROTATIONS[i % ROTATIONS.length]
        return (
          <div
            key={ev.id}
            className="group relative cursor-pointer"
            style={{ transform: `rotate(${rot}deg)`, transition: 'transform 0.5s ease-in-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rot}deg)`)}
          >
            <div className="bg-white p-2 pb-10 shadow-md rounded-sm relative">
              <div
                className="aspect-square rounded-sm flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #d5e4e8, #b8cdd3)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8FA499" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="1"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="absolute bottom-2 left-0 right-0 px-2 text-center">
                <p className="text-[10px] text-ink/60 leading-tight" style={{ fontFamily: 'var(--font-sans)' }}>
                  {ev.label}
                </p>
                <p className="text-[9px] text-muted/50 mt-0.5" style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>
                  {ev.sub}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
