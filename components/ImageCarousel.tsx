'use client'

import { useEffect, useRef, useState } from 'react'

const IMAGES = [
  'https://drive.google.com/uc?export=view&id=181MAZVmoPpX6C8S7ZppWNL9PDl7YKbdQ',
  'https://drive.google.com/uc?export=view&id=1z4UhsvNuTTSLGTcWaqW-N0Y6vkqzkqW4',
  'https://drive.google.com/uc?export=view&id=1_obmoXKMf0LpRsJLJpmjIVNj8kOpZzIc',
  'https://drive.google.com/uc?export=view&id=1-zSodW2LoL_2qnJKTWzNKZgq6CFPWljg',
]

const INTERVAL = 4000

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % IMAGES.length)
    }, INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused])

  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`社群合影 ${i + 1}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to image ${i + 1}`}
            style={{
              width: i === current ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
