'use client'

const EVENTS = [
  { id: 0, label: '再建社群 · Vol.1', sub: 'Jan 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833693/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/recommunity%E6%B5%B7%E6%8A%A5_a4kbsc.jpg' },
  { id: 1, label: '红楼梦共读', sub: 'Apr 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833714/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/%E9%9B%A8%E5%B1%B1%E5%89%8D%E7%BA%A2%E6%A5%BC%E6%A2%A6_%E7%BB%BF_1_dhrm2g.png' },
  { id: 2, label: '乱讲PPT之夜', sub: 'Mar 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833705/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/%E9%9B%A8%E5%B1%B1%E5%89%8D-%E5%A5%87%E6%80%AA%E7%9A%84%E7%9F%A5%E8%AF%861_w99jma.png' },
  { id: 3, label: '冷门学科分享大会', sub: 'Feb 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833687/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/%E5%86%B7%E9%97%A8%E5%AD%A6%E7%A7%91%E5%88%86%E4%BA%AB%E5%A4%A7%E4%BC%9A_revised_l3lr61.jpg' },
  { id: 4, label: '存在主义咖啡馆', sub: 'Mar 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833682/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/%E5%AD%98%E5%9C%A8%E4%B8%BB%E4%B9%89%E5%92%96%E5%95%A1%E9%A6%86_dt35nm.jpg' },
  { id: 5, label: '扎十一惹对谈', sub: 'Apr 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833677/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/164891774916865_.pic_hd_k3z4sd.jpg' },
  { id: 6, label: '三小时Zoom共读·白先勇', sub: 'May 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833930/ZOOM%E5%85%B1%E8%AF%BB02-%E7%99%BD%E5%85%88%E5%8B%87%E7%89%88%E6%9C%AC2_piqvbb.jpg' },
  { id: 7, label: '马克思主题共读', sub: 'May 2026', img: 'https://res.cloudinary.com/dpprzfwjf/image/upload/v1781833675/%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC/WechatIMG17903_nmcrrm.jpg' },
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
