'use client'
import { useModal } from '@/context/ModalContext'

export default function FooterClient() {
  const { openModal } = useModal()
  return (
    <button
      onClick={openModal}
      className="flex items-center gap-1.5 cursor-pointer active:scale-[0.97] active:translate-y-[1px]"
      style={{
        background: '#2E463D',
        color: '#ffffff',
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        letterSpacing: '0.08em',
        padding: '8px 18px',
        margin: '0 auto',
        borderRadius: '4px',
        border: 'none',
        transition: 'all 0.5s ease-in-out',
      }}
      onMouseEnter={(event) => { event.currentTarget.style.background = '#3a5a4e' }}
      onMouseLeave={(event) => { event.currentTarget.style.background = '#2E463D' }}
    >
      订阅
      <span style={{ opacity: 0.65, fontSize: '10px', letterSpacing: '0.14em' }}>SUBSCRIBE</span>
    </button>
  )
}
