export type ReservationSheetRow = {
  id: string
  privacyCertified: boolean
  fullName: string
  wellbeing: string
  age: string
  phone: string
  email: string
  facebookLink: string
  funFact: string
  pictureName: string
  pictureType: string
  pictureDataUrl: string
  lc: string
  department: string
  position: string
  excitement: string
  attendedNationalConference: string
  differently: string
  expectations: string
  allergies: string
  comfort: string
  comingFor: string
  feeAgreement: boolean
  createdAt: string
}

export async function appendReservationToGoogleSheet(row: ReservationSheetRow) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured.')
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(row),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets webhook failed with status ${response.status}`)
  }

  const responseText = await response.text()
  let result: { success?: boolean; error?: string }

  try {
    result = JSON.parse(responseText)
  } catch {
    throw new Error('Google Sheets webhook did not return JSON. Check that GOOGLE_SHEETS_WEBHOOK_URL is the deployed Apps Script web app /exec URL.')
  }

  if (!result.success) {
    throw new Error(result.error || 'Google Sheets webhook did not confirm success.')
  }
}
