import type { Reservation } from './store'

export const localCommittees = ['LC Babez', 'LC Benak', 'LC Bejaia', 'LC Blida', 'LC Constantine', 'LC Tlemcen', 'LC Oran']

export type LcLeaderboardItem = {
  lc: string
  order: number
  count: number
  rank: number
  progress: number
}

export function getLcLeaderboardFromCounts(registrationsByLc: Record<string, number>): LcLeaderboardItem[] {
  const ranked = localCommittees
    .map((lc, order) => ({ lc, order, count: registrationsByLc[lc] || 0 }))
    .sort((a, b) => b.count - a.count || a.order - b.order)

  const highestCount = Math.max(1, ...ranked.map((item) => item.count))

  return ranked.map((item, index) => ({
    ...item,
    rank: index + 1,
    progress: item.count === 0 ? 0 : Math.max(10, Math.round((item.count / highestCount) * 100)),
  }))
}

export function getLcLeaderboard(reservations: Pick<Reservation, 'lc'>[]): LcLeaderboardItem[] {
  const registrationsByLc = reservations.reduce<Record<string, number>>((counts, reservation) => {
    if (!reservation.lc) return counts
    counts[reservation.lc] = (counts[reservation.lc] || 0) + 1
    return counts
  }, {})

  return getLcLeaderboardFromCounts(registrationsByLc)
}
