import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getStore } from '@/lib/store'
import { appendReservationToGoogleSheet } from '@/lib/googleSheets'
import { invalidateRegistrationStatsCache } from '@/lib/registrationStats'

const goodiePackPrices: Record<string, number> = {
  'Starter pack': 1900,
  'Explorer pack': 3100,
  'Adventurer pack': 1950,
  'Premium JumanCO pack': 3400,
}

const goodiePrices = {
  tshirt: 1800,
  pin: 120,
  bracelet: 150,
  cap: 1600,
}

function getPositiveQuantity(value: unknown) {
  const quantity = Number(value)
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 0
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const store = getStore()
    const goodiePack = typeof body.goodiePack === 'string' && body.goodiePack in goodiePackPrices ? body.goodiePack : 'No pack'
    const goodiesTotal =
      (goodiePackPrices[goodiePack] || 0) +
      (body.goodieTshirt === 'Yes' ? goodiePrices.tshirt : 0) +
      (body.goodieBadge === 'Yes' ? getPositiveQuantity(body.goodieBadgeQuantity) * goodiePrices.pin : 0) +
      (body.goodieWristband === 'Yes' ? getPositiveQuantity(body.goodieWristbandQuantity) * goodiePrices.bracelet : 0) +
      (body.goodieCap === 'Yes' ? getPositiveQuantity(body.goodieCapQuantity) * goodiePrices.cap : 0)

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
      goodieTshirt: body.goodieTshirt || 'No',
      goodieTshirtSize: body.goodieTshirt === 'Yes' || goodiePack !== 'No pack' ? body.goodieTshirtSize || '' : '',
      goodiePack,
      goodiesTotal: String(goodiesTotal),
      goodieBadge: body.goodieBadge || 'No',
      goodieBadgeQuantity: body.goodieBadge === 'Yes' ? body.goodieBadgeQuantity || '' : '',
      goodieWristband: body.goodieWristband || 'No',
      goodieWristbandQuantity: body.goodieWristband === 'Yes' ? body.goodieWristbandQuantity || '' : '',
      goodieCap: body.goodieCap || 'No',
      goodieCapQuantity: body.goodieCap === 'Yes' ? body.goodieCapQuantity || '' : '',
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
        goodieTshirt: reservation.goodieTshirt,
        goodieTshirtSize: reservation.goodieTshirtSize,
        goodiePack: reservation.goodiePack,
        goodiesTotal: reservation.goodiesTotal,
        goodieBadge: reservation.goodieBadge,
        goodieBadgeQuantity: reservation.goodieBadgeQuantity,
        goodieWristband: reservation.goodieWristband,
        goodieWristbandQuantity: reservation.goodieWristbandQuantity,
        goodieCap: reservation.goodieCap,
        goodieCapQuantity: reservation.goodieCapQuantity,
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
