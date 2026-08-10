import SupportClient from '@/components/SupportClient'
import { getActivitiesPayload } from '@/lib/content'

export default async function SupportPage() {
  const data = await getActivitiesPayload()
  return <SupportClient tickets={data.tickets} />
}
