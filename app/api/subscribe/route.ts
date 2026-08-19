import { NextResponse } from 'next/server'

function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式不正确。' }, { status: 400 })
  }

  const email = typeof body === 'object' && body !== null && 'email' in body
    ? String(body.email).trim().toLowerCase()
    : ''

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: '请输入有效的邮箱地址。' }, { status: 400 })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('Mailchimp environment variables are not configured.')
    return NextResponse.json({ error: '订阅服务暂时不可用，请稍后再试。' }, { status: 503 })
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
      }),
    })

    if (response.ok) {
      return NextResponse.json({
        message: '请查收确认邮件，点击邮件中的链接完成订阅。',
      })
    }

    const errorBody = await response.json().catch(() => null)
    const mailchimpTitle = errorBody && typeof errorBody.title === 'string' ? errorBody.title : ''
    const mailchimpDetail = errorBody && typeof errorBody.detail === 'string' ? errorBody.detail : ''

    if (response.status === 400 && mailchimpTitle === 'Member Exists') {
      return NextResponse.json(
        { error: '这个邮箱已经订阅或正在等待确认，请检查收件箱。' },
        { status: 409 },
      )
    }

    console.error('Mailchimp subscription failed:', response.status, mailchimpTitle, mailchimpDetail)
    return NextResponse.json({ error: '订阅失败，请稍后再试。' }, { status: 502 })
  } catch (error) {
    console.error('Mailchimp request failed:', error)
    return NextResponse.json({ error: '订阅服务暂时不可用，请稍后再试。' }, { status: 502 })
  }
}
