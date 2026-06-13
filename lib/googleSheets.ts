import { getLcLeaderboardFromCounts, localCommittees, type LcLeaderboardItem } from './lcLeaderboard'

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
  qrCodeDataUrl: string
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
  goodieTshirt: string
  goodieTshirtSize: string
  goodiePack: string
  goodiesTotal: string
  goodieBadge: string
  goodieBadgeQuantity: string
  goodieWristband: string
  goodieWristbandQuantity: string
  goodieCap: string
  goodieCapQuantity: string
  feeAgreement: boolean
  createdAt: string
}

export type GoogleSheetRegistrationStats = {
  source: 'google-sheets'
  totalDelegates: number
  lcLeaderboard: LcLeaderboardItem[]
  updatedAt?: string
}

type GoogleSheetStatsResponse = {
  success?: boolean
  totalDelegates?: unknown
  lcLeaderboard?: Array<{
    lc?: unknown
    count?: unknown
  }>
  updatedAt?: unknown
  error?: string
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

export async function getGoogleSheetRegistrationStats(): Promise<GoogleSheetRegistrationStats> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured.')
  }

  const response = await fetch(getStatsUrl(webhookUrl), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Google Sheets stats failed with status ${response.status}`)
  }

  const responseText = await response.text()
  let result: GoogleSheetStatsResponse

  try {
    result = JSON.parse(responseText)
  } catch {
    throw new Error('Google Sheets stats did not return JSON. Deploy the latest Apps Script web app version.')
  }

  if (!result.success) {
    throw new Error(result.error || 'Google Sheets stats did not confirm success.')
  }

  if (!Array.isArray(result.lcLeaderboard)) {
    throw new Error('Google Sheets stats endpoint is not deployed yet. Paste the latest Apps Script and deploy a new web app version.')
  }

  const countsByLc = result.lcLeaderboard.reduce<Record<string, number>>((counts, item) => {
    if (typeof item.lc !== 'string' || !localCommittees.includes(item.lc)) return counts

    const count = Number(item.count)
    counts[item.lc] = Number.isFinite(count) ? count : 0
    return counts
  }, {})

  return {
    source: 'google-sheets',
    totalDelegates: toSafeNumber(result.totalDelegates),
    lcLeaderboard: getLcLeaderboardFromCounts(countsByLc),
    updatedAt: typeof result.updatedAt === 'string' ? result.updatedAt : undefined,
  }
}

function getStatsUrl(webhookUrl: string) {
  const url = new URL(webhookUrl)
  url.searchParams.set('action', 'stats')
  return url.toString()
}

function toSafeNumber(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}
