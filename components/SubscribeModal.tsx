'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useModal } from '@/context/ModalContext'
import type { Dictionary } from '@/lib/i18n-types'
import type { Locale } from '@/lib/i18n-routing'

type SubscribeStatus = 'idle' | 'submitting' | 'success' | 'error'

function PostcardSender() {
  return (
    <div className="subscribe-postcard-from">
      <span>FROM:</span>
      <div className="subscribe-postcard-logo">
        <Image
          src="/rainier-logo-horizontal-black.png"
          alt="雨山前 Rainier Literature Society"
          width={3479}
          height={1111}
          loading="eager"
          sizes="(max-width: 700px) 180px, 220px"
        />
      </div>
    </div>
  )
}

export default function SubscribeModal({
  locale,
  copy,
}: {
  locale: Locale
  copy: Dictionary['subscribe']
}) {
  const { isOpen, closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [message, setMessage] = useState('')

  const handleClose = useCallback(() => {
    setEmail('')
    setStatus('idle')
    setMessage('')
    closeModal()
  }, [closeModal])

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [handleClose, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
    }
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
        body: JSON.stringify({ email, locale }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || copy.fallbackError)
      }

      setStatus('success')
      setMessage(result.message || copy.fallbackSuccess)
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : copy.fallbackError)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="subscribe-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <section
        ref={modalRef}
        className="subscribe-modal subscribe-postcard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
        aria-describedby="subscribe-modal-description"
      >
        <button
          type="button"
          className="subscribe-modal-close"
          onClick={handleClose}
          aria-label={copy.close}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="subscribe-postcard-stamp" aria-hidden="true">
          <Image
            src="/newsletter-postcard-stamp.png"
            alt=""
            fill
            loading="eager"
            sizes="150px"
          />
        </div>

        <header className="subscribe-postcard-heading">
          <p>RAINIER LETTERS · SEATTLE</p>
          <h2 id="subscribe-modal-title">POSTCARD</h2>
          <span>{copy.weekly}</span>
        </header>

        {status === 'success' ? (
          <div className="subscribe-postcard-body subscribe-postcard-success" role="status" aria-live="polite">
            <div className="subscribe-postcard-message">
              <p className="subscribe-postcard-eyebrow">{copy.successEyebrow}</p>
              <h3>{copy.successTitle}</h3>
              <PostcardSender />
            </div>
            <div className="subscribe-postcard-recipient">
              <p id="subscribe-modal-description">{message}</p>
              <button type="button" className="subscribe-modal-return" onClick={handleClose}>
                <span>{copy.continue}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="subscribe-postcard-body">
            <div className="subscribe-postcard-message">
              <p className="subscribe-postcard-eyebrow">{copy.noteEyebrow}</p>
              <p id="subscribe-modal-description" className="subscribe-postcard-copy" style={{ whiteSpace: 'pre-line' }}>
                {copy.pitch}
              </p>
              {copy.englishNotice && (
                <p className="subscribe-postcard-language-note">{copy.englishNotice}</p>
              )}
              <PostcardSender />
            </div>

            <form
              className="subscribe-postcard-recipient subscribe-modal-form"
              onSubmit={handleSubmit}
              aria-busy={status === 'submitting'}
            >
              <div className="subscribe-postcard-to">
                <label htmlFor="subscribe-email">TO:</label>
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
                  disabled={status === 'submitting'}
                  aria-invalid={status === 'error'}
                  aria-describedby={message ? 'subscribe-feedback' : 'subscribe-privacy'}
                />
              </div>

              <div className="subscribe-postcard-address-lines" aria-hidden="true">
                <span />
                <span />
              </div>

              {message && (
                <p id="subscribe-feedback" role="alert" className="subscribe-modal-feedback">
                  {message}
                </p>
              )}

              <div className="subscribe-postcard-send">
                <p id="subscribe-privacy">{copy.privacy}</p>
                <button type="submit" disabled={status === 'submitting'}>
                  <span>{status === 'submitting' ? copy.sending : copy.submit}</span>
                  <small>{status === 'submitting' ? copy.sendingAccent : copy.submitAccent}</small>
                  <b aria-hidden="true">→</b>
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
