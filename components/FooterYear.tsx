'use client'
import { useSyncExternalStore } from 'react'

export default function FooterYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => '',
  )
  return <>{year}</>
}

function subscribe(): () => void {
  return () => {}
}
