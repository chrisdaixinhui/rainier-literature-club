import crypto from 'node:crypto'

export function requireAdmin(
  request: Request,
): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return { ok: false, status: 503, error: 'admin-not-configured' }
  }

  const auth = request.headers.get('authorization') ?? ''
  const headerKey = request.headers.get('x-admin-key') ?? ''
  const provided = headerKey || (auth.startsWith('Bearer ') ? auth.slice(7) : '')

  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  const matches = a.length === b.length && crypto.timingSafeEqual(a, b)

  if (!matches) return { ok: false, status: 401, error: 'unauthorized' }
  return { ok: true }
}
