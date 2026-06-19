'use client'

const EVENTS = [
  { id: 0, label: '再建社群 · Vol.1', sub: 'Jan 2026', img: 'https://drive.google.com/uc?export=view&id=1-awUKWSY0wvrGRqxFgHImRdKumI70oBI' },
  { id: 1, label: '红楼梦共读', sub: 'Apr 2026', img: 'https://drive.google.com/uc?export=view&id=1CFesWhTtt2YQAyDR_Tl934S3IHvZKEPC' },
  { id: 2, label: '乱讲PPT之夜', sub: 'Mar 2026', img: 'https://drive.google.com/uc?export=view&id=1zBPKK8OTQhgngPKQsK5P924zu7Ktc-W5' },
  { id: 3, label: '冷门学科分享大会', sub: 'Feb 2026', img: 'https://drive.google.com/uc?export=view&id=1BRpH11ZqSNnDoMo0RVCmd0myTetOliC7' },
  { id: 4, label: '存在主义咖啡馆', sub: 'Mar 2026', img: 'https://drive.google.com/uc?export=view&id=15Vi0xgxOprVO7Dp8LV0o7MsTLdFkCIWO' },
  { id: 5, label: '扎十一惹对谈', sub: 'Apr 2026', img: 'https://drive.google.com/uc?export=view&id=1vfAKTJ-pJ0fKOYuPyqdlKhz8JK65cJV8' },
  { id: 6, label: '三小时Zoom共读·白先勇', sub: 'May 2026', img: 'https://drive.google.com/uc?export=view&id=1nD3XXvWgoBTVTNu_o63jtfPFIifiV3PB' },
  { id: 7, label: '马克思主题共读', sub: 'May 2026', img: 'https://drive.google.com/uc?export=view&id=1WL4f3KlwvhqUqpZ4q2iIkvol0W5aXRHf' },
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
              <div className="aspect-[2/3] rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ev.img}
                  alt={ev.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
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
