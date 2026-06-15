import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')?.trim()
  const eventId = searchParams.get('event')?.trim() ?? ''

  if (!id) {
    return NextResponse.json({ error: 'Missing delegate id' }, { status: 400 })
  }

  const lookupUrl = `${WEBHOOK_URL}?action=lookup&id=${encodeURIComponent(id)}&event=${encodeURIComponent(eventId)}`
  const upstream = await fetch(lookupUrl, { cache: 'no-store' })
  const data = await upstream.json()

  if (!data.found) {
    return NextResponse.json({ error: 'Delegate not found' }, { status: 404 })
  }

  return NextResponse.json({
    delegate: data.delegate,
    alreadyCheckedIn: data.alreadyCheckedIn ?? false,
  })
}
