import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import CountdownTimer from '@/components/CountdownTimer'
import { getStore } from '@/lib/store'

const features = [
  {
    href: '/seat',
    label: 'Claim Camp Access',
    desc: 'Register your delegation, add your details, and generate the gate pass for check-in.',
  },
  {
    href: '/location',
    label: 'Basecamp Map',
    desc: 'Explore the venue, the transport notes, and the full conference schedule.',
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
]

const highlights = ['3 days of conference energy', '9 active local committees on-site']
const countdownTarget = process.env.NEXT_PUBLIC_COUNTDOWN_TARGET || '2026-06-15T09:00:00+01:00'

export default function HomePage() {
  noStore()

  const delegateCount = getStore().reservations.length
  const stats = [
    { value: delegateCount.toString(), label: 'Delegates' },
    { value: '7', label: 'Local Committees' },
    { value: '3', label: 'Days' },
    { value: '20+', label: 'Sessions' },
  ]

  return (
    <div className="paper-page">
      <div className="paper-container">
        <CountdownTimer targetDate={countdownTarget} />

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.95fr) minmax(340px, 1.05fr)',
            gap: '26px',
            alignItems: 'start',
          }}
          className="hero-grid"
        >
          <div className="animate-in" style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {highlights.map((note) => (
                <span key={note} className="board-chip">
                  {note}
                </span>
              ))}
            </div>

            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              <div className="logo-wordmark" style={{ fontSize: 'clamp(56px, 11vw, 108px)' }}>
                Juma
                <br />
                nco
              </div>
              <div style={{ position: 'absolute', top: '-8px', left: '-20px', width: '26px', height: '42px', borderRadius: '30px', background: '#6fc16a', transform: 'rotate(-24deg)' }} />
              <div style={{ position: 'absolute', top: '42px', right: '-10px', width: '22px', height: '34px', borderRadius: '30px', background: '#7ebf57', transform: 'rotate(18deg)' }} />
              <div style={{ position: 'absolute', bottom: '2px', left: '58%', width: '18px', height: '28px', borderRadius: '30px', background: '#87ca64', transform: 'rotate(10deg)' }} />
            </div>

            <p className="section-kicker" style={{ marginBottom: '14px' }}>
              National Conference 2025
            </p>
            <h1 className="board-title" style={{ fontSize: 'clamp(36px, 5.5vw, 62px)', lineHeight: 1.02, marginBottom: '16px' }}>
              A bright jungle-board experience for the whole conference.
            </h1>
            <p style={{ color: '#5f4930', fontSize: '17px', lineHeight: 1.8, maxWidth: '560px', marginBottom: '24px' }}>
              JUMANCO now feels like one playful game board from top to bottom. Register delegates, check the map, follow the schedule, share campfire stories, and keep every part of the conference inside the same world.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link href="/seat" className="wood-button">
                Enter The Camp
              </Link>
              <Link href="/location#schedule" className="wood-button alt">
                View Schedule
              </Link>
            </div>
          </div>

          <div className="board-panel animate-in float-board" style={{ padding: '28px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="section-kicker" style={{ marginBottom: '10px' }}>
                Expedition Brief
              </p>
              <h2 className="board-title" style={{ fontSize: '32px', marginBottom: '20px' }}>
                Conference Snapshot
              </h2>

              <div className="board-grid" style={{ marginBottom: '18px' }}>
                {stats.map((stat) => (
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
                  { step: '02', title: 'Follow The Route', desc: 'Check rooms, travel info, and the full schedule.' },
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
                  <Link key={feature.href} href={feature.href} className="board-link animate-in card-hover">
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
