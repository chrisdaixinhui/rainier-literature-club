import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  revalidateTag('activities', 'max')
  return Response.json({ ok: true, data: { revalidated: true } })
}
