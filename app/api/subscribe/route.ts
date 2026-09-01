import { NextResponse } from 'next/server'
import { isLocale, type Locale } from '@/lib/i18n-routing'

const messages: Record<Locale, {
  invalidRequest: string
  invalidEmail: string
  unavailable: string
  success: string
  exists: string
  failed: string
}> = {
  zh: {
    invalidRequest: '请求格式不正确。',
    invalidEmail: '请输入有效的邮箱地址。',
    unavailable: '订阅服务暂时不可用，请稍后再试。',
    success: '请查收确认邮件，点击邮件中的链接完成订阅。',
    exists: '这个邮箱已经订阅或正在等待确认，请检查收件箱。',
    failed: '订阅失败，请稍后再试。',
  },
  en: {
    invalidRequest: 'The request format is invalid.',
    invalidEmail: 'Enter a valid email address.',
    unavailable: 'The subscription service is temporarily unavailable. Please try again later.',
    success: 'Check your inbox and follow the confirmation link to complete your subscription.',
    exists: 'This email is already subscribed or awaiting confirmation. Please check your inbox.',
    failed: 'We could not subscribe you just now. Please try again later.',
  },
}

function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: messages.zh.invalidRequest }, { status: 400 })
  }

  const requestedLocale = typeof body === 'object' && body !== null && 'locale' in body
    ? String(body.locale)
    : ''
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : 'zh'
  const copy = messages[locale]

  const email = typeof body === 'object' && body !== null && 'email' in body
    ? String(body.email).trim().toLowerCase()
    : ''

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: copy.invalidEmail }, { status: 400 })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('Mailchimp environment variables are not configured.')
    return NextResponse.json({ error: copy.unavailable }, { status: 503 })
  }

  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`
  const authorization = Buffer.from(`anystring:${apiKey}`).toString('base64')

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending',
        language: locale,
      }),
    })

    if (response.ok) {
      return NextResponse.json({
        message: copy.success,
      })
    }

    const errorBody = await response.json().catch(() => null)
    const mailchimpTitle = errorBody && typeof errorBody.title === 'string' ? errorBody.title : ''
    const mailchimpDetail = errorBody && typeof errorBody.detail === 'string' ? errorBody.detail : ''

    if (response.status === 400 && mailchimpTitle === 'Member Exists') {
      return NextResponse.json(
        { error: copy.exists },
        { status: 409 },
      )
    }

    console.error('Mailchimp subscription failed:', response.status, mailchimpTitle, mailchimpDetail)
    return NextResponse.json({ error: copy.failed }, { status: 502 })
  } catch (error) {
    console.error('Mailchimp request failed:', error)
    return NextResponse.json({ error: copy.unavailable }, { status: 502 })
  }
}
