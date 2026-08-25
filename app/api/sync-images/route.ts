import { requireAdmin } from '@/lib/admin'
import { syncActivityPosters } from '@/lib/notionSync'
import { revalidateTag } from 'next/cache'

async function handle(request: Request) {
  const auth = requireAdmin(request)
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const result = await syncActivityPosters()
    if (result.synced > 0) {
      revalidateTag('activities', 'max')
    }
    return Response.json({ ok: true, data: result })
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: 'sync-failed',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
