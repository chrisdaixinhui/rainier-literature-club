'use client'
import { useEffect, useRef } from 'react'
import { useModal } from '@/context/ModalContext'

export default function SubscribeModal() {
  const { isOpen, closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div
        className="relative bg-off-white rounded-2xl p-10 md:p-12 w-[90vw] max-w-md text-center shadow-2xl"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-5 text-mist hover:text-ink text-xl leading-none transition-colors"
          aria-label="关闭"
        >
          ✕
        </button>

        <div className="text-4xl mb-4">🌧️</div>

        <h2 className="text-2xl font-bold text-ink mb-2" style={{ fontFamily: 'var(--font-serif)' }}>每周一封信</h2>
        <p className="text-sm text-mist italic mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Weekly Letter from 雨山前
        </p>
        <p className="text-sm text-ink/60 mt-3 mb-6 leading-relaxed">
          活动预告 · 每日一句 · 一本书推荐
        </p>

        <input
          ref={inputRef}
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-mist/40 rounded-md text-sm outline-none focus:border-moss transition-colors mb-3 bg-white"
        />
        <button className="w-full py-3 bg-moss text-white rounded-md text-sm font-medium hover:bg-moss-dark transition-colors">
          订阅 Subscribe
        </button>
        <p className="text-xs text-ink/30 mt-3">我们只发精心策划的内容，无垃圾邮件。</p>
      </div>
    </div>
  )
}
