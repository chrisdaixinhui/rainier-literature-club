import { Suspense } from 'react'
import SupportClient from '@/components/SupportClient'
import { getActivitiesPayload } from '@/lib/content'

async function SupportContent() {
  const data = await getActivitiesPayload()
  return <SupportClient tickets={data.tickets} />
}

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportContent />
    </Suspense>
  )
}
