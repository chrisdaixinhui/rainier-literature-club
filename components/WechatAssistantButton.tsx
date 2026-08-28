'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const WECHAT_ASSISTANT_URL = 'https://u.wechat.com/MN7tB6VUCYU1PiKC1swL79Y'

export default function WechatAssistantButton() {
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
        <span>雨山前小助手 · 添加微信</span>
        <small>WECHAT ASSISTANT</small>
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
            aria-label="关闭小助手微信二维码"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <div className="wechat-assistant-copy">
            <p>WECHAT · 雨山前小助手</p>
            <h2 id="wechat-assistant-title">扫码添加小助手</h2>
            <p id="wechat-assistant-description">
              获取最新活动通知，也欢迎来和我们聊聊书与生活。
            </p>
          </div>

          <div className="wechat-assistant-qr-frame">
            <Image
              src="/contact-wechat-assistant.jpg"
              alt="雨山前小助手微信二维码"
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
            <span>在微信中打开</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </dialog>
    </>
  )
}
