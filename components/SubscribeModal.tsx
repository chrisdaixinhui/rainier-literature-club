'use client'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useModal } from '@/context/ModalContext'

export default function SubscribeModal() {
  const { isOpen, closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleClose = useCallback(() => {
    setEmail('')
    setStatus('idle')
    setMessage('')
    closeModal()
  }, [closeModal])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (status === 'submitting') return

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '订阅失败，请稍后再试。')
      }

      setStatus('success')
      setMessage(result.message || '请查收确认邮件，完成订阅。')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : '订阅失败，请稍后再试。')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className="relative bg-off-white rounded-2xl p-10 md:p-12 w-[90vw] max-w-md text-center shadow-2xl"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <button
          onClick={handleClose}
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

        <form onSubmit={handleSubmit}>
          <label htmlFor="subscribe-email" className="sr-only">邮箱地址</label>
          <input
            ref={inputRef}
            id="subscribe-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            required
            disabled={status === 'submitting' || status === 'success'}
            className="w-full px-4 py-3 border border-mist/40 rounded-md text-sm outline-none focus:border-moss transition-colors mb-3 bg-white disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'success'}
            className="w-full py-3 bg-moss text-white rounded-md text-sm font-medium hover:bg-moss-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? '提交中…' : status === 'success' ? '已提交' : '订阅 Subscribe'}
          </button>
        </form>
        {message && (
          <p
            role="status"
            className={`text-xs mt-3 ${status === 'error' ? 'text-red-700' : 'text-moss'}`}
          >
            {message}
          </p>
        )}
        {!message && <p className="text-xs text-ink/30 mt-3">我们只发精心策划的内容，无垃圾邮件。</p>}
      </div>
    </div>
  )
}
