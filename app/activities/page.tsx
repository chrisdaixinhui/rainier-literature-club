import ActivitiesClient from '@/components/ActivitiesClient'
import { getActivitiesPayload } from '@/lib/content'

export default async function ActivitiesPage() {
  const data = await getActivitiesPayload()
  return <ActivitiesClient initialData={data} />
}
