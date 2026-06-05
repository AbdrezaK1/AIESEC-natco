import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { Medal, Trophy, UsersRound } from 'lucide-react'
import { localCommittees } from '@/lib/lcLeaderboard'
import { getRegistrationStats } from '@/lib/registrationStats'

export default async function LeaderboardPage() {
  noStore()

  const registrationStats = await getRegistrationStats()
  const leaderboard = registrationStats.lcLeaderboard
  const totalDelegates = registrationStats.totalDelegates
  const leader = leaderboard[0]
  const activeLcs = leaderboard.filter((item) => item.count > 0).length

  return (
    <div className="paper-page">
      <div className="paper-container" style={{ maxWidth: '980px' }}>
        <section className="leaderboard-hero animate-in">
          <div className="official-logo-shell hero-official-logo leaderboard-logo">
            <img className="official-logo-image" src="/jumanco-logo.png" alt="Juman'CO official conference logo" />
          </div>
          <div className="leaderboard-hero-copy">
            <p className="section-kicker" style={{ marginBottom: '12px' }}>
              LC Leaderboard
            </p>
            <h1 className="board-title">Registered Delegates By LC</h1>
            <p>
              Follow which local committees are filling the Juman'CO game board. The ranking updates from registrations saved in Google Sheets.
            </p>
            <div className="leaderboard-actions">
              <Link href="/seat" className="wood-button">
                Register
              </Link>
              <Link href="/" className="wood-button alt">
                Back Home
              </Link>
            </div>
          </div>
        </section>

        <section className="leaderboard-stat-grid animate-in" aria-label="Leaderboard summary">
          {[
            { label: 'Delegates', value: totalDelegates.toString(), icon: UsersRound },
            { label: 'Active LCs', value: `${activeLcs}/${localCommittees.length}`, icon: Medal },
            { label: 'Current Leader', value: leader?.count ? leader.lc.replace('LC ', '') : 'Waiting', icon: Trophy },
          ].map((stat) => {
            const Icon = stat.icon

            return (
              <div key={stat.label} className="metric-card leaderboard-stat-card">
                <Icon size={22} aria-hidden="true" />
                <p>{stat.value}</p>
                <span className="section-kicker">{stat.label}</span>
              </div>
            )
          })}
        </section>

        <section className="board-panel lc-leaderboard-panel leaderboard-full-panel animate-in" aria-label="Full LC registration leaderboard">
          <div className="lc-leaderboard-content">
            <div className="lc-leaderboard-header">
              <div className="lc-leaderboard-icon" aria-hidden="true">
                <Trophy size={26} />
              </div>
              <div>
                <p className="section-kicker">Full Ranking</p>
                <h2 className="board-title">All Local Committees</h2>
              </div>
            </div>

            <div className="lc-leaderboard-list leaderboard-full-list">
              {leaderboard.map((item) => (
                <div key={item.lc} className="lc-leaderboard-row">
                  <div className={`lc-leaderboard-rank ${item.rank <= 3 ? 'is-podium' : ''}`}>{item.rank}</div>
                  <div className="lc-leaderboard-main">
                    <div className="lc-leaderboard-name-line">
                      <span>{item.lc}</span>
                      <strong>
                        {item.count} {item.count === 1 ? 'delegate' : 'delegates'}
                      </strong>
                    </div>
                    <div className="lc-leaderboard-track" aria-hidden="true">
                      <div className="lc-leaderboard-fill" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
