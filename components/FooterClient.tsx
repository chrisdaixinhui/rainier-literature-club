'use client'
import { useModal } from '@/context/ModalContext'

export default function FooterClient() {
  const { openModal } = useModal()
  return (
    <button
      onClick={openModal}
      className="text-sm font-medium px-5 py-2 bg-moss text-white rounded-md hover:bg-moss-dark transition-colors"
    >
      订阅 Subscribe
    </button>
  )
}
