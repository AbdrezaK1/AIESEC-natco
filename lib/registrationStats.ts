import { getGoogleSheetRegistrationStats } from './googleSheets'
import type { LcLeaderboardItem } from './lcLeaderboard'
import { getLcLeaderboard } from './lcLeaderboard'
import { getStore } from './store'

export type RegistrationStats = {
  source: 'google-sheets' | 'local-memory'
  totalDelegates: number
  lcLeaderboard: LcLeaderboardItem[]
  updatedAt?: string
  error?: string
}

const CACHE_TTL_MS = 15_000

let cachedStats: RegistrationStats | null = null
let cachedAt = 0
let inFlight: Promise<RegistrationStats> | null = null

async function fetchRegistrationStats(): Promise<RegistrationStats> {
  try {
    return await getGoogleSheetRegistrationStats()
  } catch (error) {
    const reservations = getStore().reservations

    return {
      source: 'local-memory',
      totalDelegates: reservations.length,
      lcLeaderboard: getLcLeaderboard(reservations),
      error: error instanceof Error ? error.message : 'Google Sheets stats are unavailable.',
    }
  }
}

export function invalidateRegistrationStatsCache() {
  cachedStats = null
  cachedAt = 0
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const now = Date.now()

  if (cachedStats && now - cachedAt < CACHE_TTL_MS) {
    return cachedStats
  }

  if (inFlight) {
    return inFlight
  }

  inFlight = fetchRegistrationStats()
    .then((stats) => {
      cachedStats = stats
      cachedAt = Date.now()
      return stats
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}
