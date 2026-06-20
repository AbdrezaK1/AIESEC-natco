import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getStore } from '@/lib/store'
import { appendReservationToGoogleSheet } from '@/lib/googleSheets'
import { invalidateRegistrationStatsCache } from '@/lib/registrationStats'

const braceletPrice = 150

function getPositiveQuantity(value: unknown) {
  const quantity = Number(value)
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 0
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const store = getStore()
    const goodiesTotal = body.goodieWristband === 'Yes'
      ? getPositiveQuantity(body.goodieWristbandQuantity) * braceletPrice
      : 0

    const id = `JUM-${Date.now().toString(36).toUpperCase()}`
    const qrPayload = JSON.stringify({
      id,
      fullName: body.fullName,
      email: body.email,
      lc: body.lc,
      department: body.department,
      position: body.position,
      comingFor: body.comingFor,
    })
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
    })

    const reservation = {
      id,
      privacyCertified: Boolean(body.privacyCertified),
      fullName: body.fullName,
      wellbeing: body.wellbeing,
      age: body.age,
      email: body.email,
      phone: body.phone,
      facebookLink: body.facebookLink,
      funFact: body.funFact,
      pictureName: body.pictureName,
      pictureType: body.pictureType,
      pictureDataUrl: body.pictureDataUrl,
      lc: body.lc,
      department: body.department,
      position: body.position,
      excitement: body.excitement,
      attendedNationalConference: body.attendedNationalConference,
      differently: body.differently || '',
      expectations: body.expectations,
      allergies: body.allergies || '',
      comfort: body.comfort || '',
      comingFor: body.comingFor,
      goodiesTotal: String(goodiesTotal),
      goodieWristband: body.goodieWristband || 'No',
      goodieWristbandQuantity: body.goodieWristband === 'Yes' ? body.goodieWristbandQuantity || '' : '',
      feeAgreement: Boolean(body.feeAgreement),
      qrCodeDataUrl,
      createdAt: new Date().toISOString(),
    }

    store.reservations.push(reservation)

    let sheetsSynced = true
    let sheetsError = ''
    try {
      await appendReservationToGoogleSheet({
        id: reservation.id,
        privacyCertified: reservation.privacyCertified,
        fullName: reservation.fullName,
        wellbeing: reservation.wellbeing,
        age: reservation.age,
        email: reservation.email,
        phone: reservation.phone,
        facebookLink: reservation.facebookLink,
        funFact: reservation.funFact,
        pictureName: reservation.pictureName,
        pictureType: reservation.pictureType,
        pictureDataUrl: reservation.pictureDataUrl,
        qrCodeDataUrl: reservation.qrCodeDataUrl,
        lc: reservation.lc,
        department: reservation.department,
        position: reservation.position,
        excitement: reservation.excitement,
        attendedNationalConference: reservation.attendedNationalConference,
        differently: reservation.differently,
        expectations: reservation.expectations,
        allergies: reservation.allergies,
        comfort: reservation.comfort,
        comingFor: reservation.comingFor,
        goodiesTotal: reservation.goodiesTotal,
        goodieWristband: reservation.goodieWristband,
        goodieWristbandQuantity: reservation.goodieWristbandQuantity,
        feeAgreement: reservation.feeAgreement,
        createdAt: reservation.createdAt,
      })
      invalidateRegistrationStatsCache()
    } catch (sheetError) {
      sheetsSynced = false
      sheetsError = sheetError instanceof Error ? sheetError.message : 'Google Sheets sync failed'
      console.error('Google Sheets sync failed:', sheetError)
    }

    return NextResponse.json({
      id,
      success: true,
      sheetsSynced,
      sheetsError,
      qrCodeDataUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reservation failed'
    console.error('Reservation failed:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function GET() {
  const store = getStore()
  return NextResponse.json(store.reservations)
}
