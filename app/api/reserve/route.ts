import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getStore } from '@/lib/store'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const store = getStore()

  const id = `JUM-${Date.now().toString(36).toUpperCase()}`
  const qrPayload = JSON.stringify({
    id,
    fullName: body.fullName,
    email: body.email,
    lc: body.lc,
    role: body.role,
  })
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 300,
  })

  const reservation = {
    id,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    lc: body.lc,
    role: body.role,
    diet: body.diet,
    allergies: body.allergies || '',
    roommate: body.roommate,
    qrCodeDataUrl,
    createdAt: new Date().toISOString(),
  }

  store.reservations.push(reservation)

  return NextResponse.json({
    id,
    success: true,
    qrCodeDataUrl,
  })
}

export async function GET() {
  const store = getStore()
  return NextResponse.json(store.reservations)
}
