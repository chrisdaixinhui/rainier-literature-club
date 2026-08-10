import crypto from 'node:crypto'

export interface CloudinaryUploadResult {
  secureUrl: string
  publicId: string
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

/**
 * Uploads image bytes to Cloudinary and returns the permanent public URL.
 * Uses a signed upload so no unsigned preset is required.
 */
export async function uploadImageToCloudinary(
  data: Buffer,
  filename: string,
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const apiKey = process.env.CLOUDINARY_API_KEY!
  const apiSecret = process.env.CLOUDINARY_API_SECRET!
  const folder = process.env.CLOUDINARY_FOLDER || 'rainier/activities'
  const timestamp = String(Math.floor(Date.now() / 1000))

  const cleaned = filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.(jpe?g|png|webp|gif)$/i, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  const baseName = cleaned || 'poster'
  const publicId = `${Date.now()}-${baseName || 'poster'}`

  const paramsToSign: Record<string, string> = {
    folder,
    overwrite: 'true',
    public_id: publicId,
    timestamp,
  }
  const signature = signCloudinaryParams(paramsToSign, apiSecret)

  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(data)]), filename)
  form.append('api_key', apiKey)
  form.append('timestamp', timestamp)
  form.append('folder', folder)
  form.append('public_id', publicId)
  form.append('overwrite', 'true')
  form.append('signature', signature)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: form,
    },
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Cloudinary upload failed (${res.status}): ${detail.slice(0, 300)}`)
  }

  const result = (await res.json()) as { secure_url?: string; public_id?: string }
  if (!result.secure_url) {
    throw new Error('Cloudinary upload returned no secure_url')
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id ?? publicId,
  }
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return crypto.createHash('sha1').update(sorted + apiSecret).digest('hex')
}
