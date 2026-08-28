import { Suspense } from 'react'
import ActivitiesClient from '@/components/ActivitiesClient'
import { getActivitiesPayload } from '@/lib/content'

async function ActivitiesContent() {
  const data = await getActivitiesPayload()
  return <ActivitiesClient initialData={data} />
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={null}>
      <ActivitiesContent />
    </Suspense>
  )
}
