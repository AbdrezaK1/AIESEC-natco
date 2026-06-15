import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL!

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { delegateId, eventId, eventName, organizer } = body

  if (!delegateId || !eventId) {
    return NextResponse.json({ error: 'Missing delegateId or eventId' }, { status: 400 })
  }

  const upstream = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'checkin',
      delegateId,
      eventId,
      eventName: eventName ?? eventId,
      organizer: organizer ?? 'Unknown',
      checkedInAt: new Date().toISOString(),
    }),
    cache: 'no-store',
  })

  const text = await upstream.text()
  let result: { success?: boolean; error?: string }
  try {
    result = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Unexpected response from sheet' }, { status: 502 })
  }

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? 'Sheet write failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
