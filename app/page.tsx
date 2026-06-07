import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { Trophy, UsersRound } from 'lucide-react'
import CountdownTimer from '@/components/CountdownTimer'
import JungleQuestBoard from '@/components/JungleQuestBoard'
import LiveDelegateCount from '@/components/LiveDelegateCount'
import { getRegistrationStats } from '@/lib/registrationStats'

const features = [
  {
    href: '/seat',
    label: 'Claim Camp Access',
    desc: 'Register your delegation, add your details, and generate the gate pass for check-in.',
  },
  {
    href: '/location',
    label: 'Basecamp Map',
    desc: 'Explore the venue map, basecamp details, and the schedule update.',
  },
  {
    href: '/gossip',
    label: 'Campfire Buzz',
    desc: 'Drop anonymous stories and follow the funniest conference moments.',
  },
  {
    href: '/wishes',
    label: 'Totem Wishes',
    desc: 'Leave kind messages, blessings, and energy for delegates across the camp.',
  },
  {
    href: '/leaderboard',
    label: 'LC Leaderboard',
    desc: 'Track which local committees are filling the game board fastest.',
  },
]

const highlights = ['3 days of conference energy', '7 active local committees on-site']
const countdownTarget = process.env.NEXT_PUBLIC_COUNTDOWN_TARGET || '2026-06-15T09:00:00+01:00'

export default async function HomePage() {
  noStore()

  const registrationStats = await getRegistrationStats()
  const delegateCount = registrationStats.totalDelegates
  const lcLeaderboardPreview = registrationStats.lcLeaderboard.slice(0, 3)

  const conferenceStats = [
    { value: <LiveDelegateCount initialCount={delegateCount} />, label: 'Delegates' },
    { value: '7', label: 'Local Committees' },
    { value: '3', label: 'Days' },
    { value: '20+', label: 'Sessions' },
  ]

  return (
    <div className="paper-page jungle-page">
      <div className="paper-container">
        <CountdownTimer targetDate={countdownTarget} />

        <section
          className="hero-grid snapshot-first-layout jungle-hero animate-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.86fr) minmax(340px, 1.14fr)',
            gap: '26px',
            alignItems: 'start',
            marginBottom: '26px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {highlights.map((note) => (
                <span key={note} className="board-chip">
                  {note}
                </span>
              ))}
            </div>

            <div className="official-logo-shell hero-official-logo">
              <img className="official-logo-image" src="/jumanco-logo.png" alt="Juman'CO official conference logo" />
            </div>

            <p className="section-kicker" style={{ marginBottom: '14px' }}>
              National Conference 2025
            </p>
            <h1 className="board-title" style={{ fontSize: 'clamp(36px, 5.5vw, 62px)', lineHeight: 1.02, marginBottom: '16px' }}>
              A bright jungle-board experience for the whole conference.
            </h1>
            <p style={{ color: '#5f4930', fontSize: '17px', lineHeight: 1.8, maxWidth: '560px', marginBottom: '24px' }}>
              Juman'CO now feels like one playful game board from top to bottom. Register delegates, check the map, follow schedule updates, share campfire stories, and keep every part of the conference inside the same world.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/seat" className="wood-button">
                Enter The Camp
              </Link>
              <Link href="/location#schedule" className="wood-button alt">
                Schedule Update
              </Link>
            </div>
          </div>

          <div className="board-panel float-board snapshot-first-panel" style={{ padding: '28px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="section-kicker" style={{ marginBottom: '10px' }}>
                Expedition Brief
              </p>
              <h2 className="board-title" style={{ fontSize: '32px', marginBottom: '20px' }}>
                Conference Snapshot
              </h2>

            <div className="board-grid" style={{ marginBottom: '18px' }}>
              {conferenceStats.map((stat) => (
                <div key={stat.label} className="metric-card">
                  <p style={{ fontSize: '30px', color: '#4b2912', fontWeight: 700, marginBottom: '6px' }}>{stat.value}</p>
                  <p className="section-kicker" style={{ color: '#7c5a33' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.32)',
                border: '3px solid rgba(107, 61, 28, 0.14)',
                borderRadius: '22px',
                padding: '18px',
              }}
            >
              {[
                { step: '01', title: 'Register Delegates', desc: 'Collect the basic info and generate each QR pass.' },
                { step: '02', title: 'Follow The Route', desc: 'Check rooms, travel info, and the schedule update.' },
                { step: '03', title: 'Build The Energy', desc: 'Share wishes, stories, and moments from the camp.' },
              ].map((item, index) => (
                <div
                  key={item.step}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    paddingBottom: index < 2 ? '12px' : 0,
                    marginBottom: index < 2 ? '12px' : 0,
                    borderBottom: index < 2 ? '1px solid rgba(107, 61, 28, 0.12)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ffd72f',
                      border: '3px solid #6a3416',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4c250f',
                      fontWeight: 700,
                      fontSize: '11px',
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p style={{ color: '#4d2d16', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</p>
                    <p style={{ color: '#6b5136', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>

        <section className="delegate-counter-panel animate-in" aria-label="Number of delegates registered">
          <div className="delegate-counter-icon" aria-hidden="true">
            <UsersRound size={28} />
          </div>
          <div className="delegate-counter-copy">
            <p className="section-kicker">Number of Delegates</p>
            <p>Registered players currently inside the game.</p>
          </div>
          <div className="delegate-counter-number">
            <LiveDelegateCount initialCount={delegateCount} />
          </div>
        </section>

        <JungleQuestBoard />

        <section className="board-panel lc-leaderboard-panel lc-leaderboard-shortcut animate-in" aria-label="LC registration leaderboard shortcut">
          <div className="lc-leaderboard-content">
            <div className="lc-leaderboard-header">
              <div className="lc-leaderboard-icon" aria-hidden="true">
                <Trophy size={26} />
              </div>
              <div>
                <p className="section-kicker">LC Leaderboard</p>
                <h2 className="board-title">Top Registered LCs</h2>
              </div>
            </div>

            <p className="lc-leaderboard-summary">
              Quick look at the current top three. Open the full board to see every LC ranking.
            </p>

            <div className="lc-leaderboard-list">
              {lcLeaderboardPreview.map((item) => (
                <div key={item.lc} className="lc-leaderboard-row">
                  <div className="lc-leaderboard-rank is-podium">{item.rank}</div>
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

            <div className="lc-leaderboard-actions">
              <Link href="/leaderboard" className="wood-button">
                Open Leaderboard
              </Link>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '26px' }}>
          <div className="board-panel" style={{ padding: '26px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="section-kicker" style={{ marginBottom: '10px' }}>
                Conference Surfaces
              </p>
              <h2 className="board-title" style={{ fontSize: '34px', marginBottom: '10px' }}>
                Every Route Shares The Same Board
              </h2>
              <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8, maxWidth: '680px', marginBottom: '24px' }}>
                The experience now carries the same chunky logo energy, parchment background, and playful conference-board styling across the main pages.
              </p>

              <div className="board-grid">
                {features.map((feature, index) => (
                  <Link key={feature.href} href={feature.href} className="board-link game-route-link animate-in card-hover">
                    <div
                      className="metric-card"
                      style={{
                        height: '100%',
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255, 245, 222, 0.7)',
                      }}
                    >
                      <p className="section-kicker" style={{ marginBottom: '8px' }}>
                        Route {index + 1}
                      </p>
                      <h3 className="board-title" style={{ fontSize: '22px', marginBottom: '10px' }}>
                        {feature.label}
                      </h3>
                      <p style={{ color: '#6b5136', fontSize: '14px', lineHeight: 1.75 }}>{feature.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
