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

export async function getRegistrationStats(): Promise<RegistrationStats> {
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
