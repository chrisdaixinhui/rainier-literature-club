'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/lib/i18n-types'

const WECHAT_ASSISTANT_URL = 'https://u.wechat.com/MN7tB6VUCYU1PiKC1swL79Y'

export default function WechatAssistantButton({ copy }: { copy: Dictionary['wechat'] }) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className="wechat-assistant-trigger"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        <span>{copy.trigger}</span>
        <small>{copy.triggerAccent}</small>
        <span className="wechat-assistant-trigger-arrow" aria-hidden="true">↗</span>
      </button>

      <dialog
        ref={dialogRef}
        className="wechat-assistant-dialog"
        aria-labelledby="wechat-assistant-title"
        aria-describedby="wechat-assistant-description"
        onCancel={(event) => {
          event.preventDefault()
          setIsOpen(false)
        }}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false)
        }}
      >
        <div className="wechat-assistant-card">
          <button
            type="button"
            className="wechat-assistant-close"
            onClick={() => setIsOpen(false)}
            aria-label={copy.close}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <div className="wechat-assistant-copy">
            <p>{copy.eyebrow}</p>
            <h2 id="wechat-assistant-title">{copy.title}</h2>
            <p id="wechat-assistant-description">
              {copy.description}
            </p>
          </div>

          <div className="wechat-assistant-qr-frame">
            <Image
              src="/contact-wechat-assistant.jpg"
              alt={copy.qrAlt}
              width={1074}
              height={1455}
              sizes="(max-width: 480px) 78vw, 290px"
              priority={false}
            />
          </div>

          <a
            href={WECHAT_ASSISTANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="wechat-assistant-open-link"
          >
            <span>{copy.open}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </dialog>
    </>
  )
}
