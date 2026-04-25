'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Reservation {
  id: string
  fullName: string
  email: string
  lc: string
  role: string
  diet: string
  allergies: string
  roommate: string
  qrCodeDataUrl: string
  createdAt: string
}

const scheduleHighlights = [
  { time: 'Jul 18 11:00', title: 'Opening ceremony' },
  { time: 'Jul 19 21:00', title: 'Jungle night rally' },
  { time: 'Jul 20 11:00', title: 'Awards and recognition' },
]

export default function ProfilePage() {
  const [reservationId, setReservationId] = useState('')
  const [data, setData] = useState<Reservation | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const lookup = async () => {
    if (!reservationId.trim()) return
    setLoading(true)
    setNotFound(false)
    setData(null)
    try {
      const res = await fetch('/api/reserve')
      const all: Reservation[] = await res.json()
      const found = all.find((reservation) => reservation.id.toLowerCase() === reservationId.trim().toLowerCase())
      if (found) setData(found)
      else setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="paper-page">
      <div className="paper-container" style={{ maxWidth: '920px' }}>
        <div className="animate-in" style={{ marginBottom: '24px' }}>
          <p className="section-kicker" style={{ marginBottom: '10px' }}>
            Explorer Portal
          </p>
          <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 54px)', marginBottom: '12px' }}>
            My Profile
          </h1>
          <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8 }}>
            Use your expedition ID to open your delegate card, your QR pass, and your registration details.
          </p>
        </div>

        {!data ? (
          <div className="board-panel animate-in" style={{ padding: '28px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <label className="section-kicker" style={{ display: 'block', marginBottom: '8px' }}>
                Expedition ID
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  placeholder="Example: JUM-ABC123"
                  value={reservationId}
                  onChange={(event) => setReservationId(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && lookup()}
                  style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', flex: 1 }}
                />
                <button onClick={lookup} disabled={loading} className="wood-button">
                  {loading ? 'Searching...' : 'Look Up'}
                </button>
              </div>
              {notFound ? <p style={{ color: '#b23e23', fontSize: '13px', marginTop: '12px' }}>Reservation not found. Double-check the expedition ID.</p> : null}
              <p style={{ color: '#7e674b', fontSize: '13px', marginTop: '12px' }}>
                Need to register first?{' '}
                <Link href="/seat" style={{ color: '#6a3416', fontWeight: 700, textDecoration: 'none' }}>
                  Claim your place
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in" style={{ display: 'grid', gap: '16px' }}>
            <div className="board-panel" style={{ padding: '28px' }}>
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, 0.85fr)',
                  gap: '22px',
                }}
                className="hero-grid"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                        border: '4px solid #6a3416',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4a230f',
                        fontWeight: 700,
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {data.fullName
                        .split(' ')
                        .map((name) => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="board-title" style={{ fontSize: '28px', marginBottom: '6px' }}>
                        {data.fullName}
                      </p>
                      <p style={{ color: '#6a5035', fontSize: '14px' }}>
                        {data.role} | {data.lc}
                      </p>
                    </div>
                  </div>

                  <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
                    {[
                      ['Expedition ID', data.id],
                      ['Diet', data.diet === 'none' ? 'Standard' : data.diet],
                      ['Allergies', data.allergies || 'None noted'],
                      ['Roommate', data.roommate || 'Not specified'],
                      ['Registered', new Date(data.createdAt).toLocaleDateString('en-GB')],
                    ].map(([label, value]) => (
                      <div key={label} className="metric-card">
                        <p className="section-kicker" style={{ marginBottom: '6px' }}>
                          {label}
                        </p>
                        <p
                          style={{
                            color: label === 'Expedition ID' ? '#6a3416' : '#4d2d16',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: label === 'Expedition ID' ? 'DM Mono, monospace' : 'inherit',
                            wordBreak: 'break-word',
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="metric-card" style={{ textAlign: 'center' }}>
                  <p className="section-kicker" style={{ marginBottom: '10px' }}>
                    Check-In QR
                  </p>
                  <img
                    src={data.qrCodeDataUrl}
                    alt="Reservation QR code"
                    style={{
                      width: '220px',
                      height: '220px',
                      background: '#fffdfa',
                      borderRadius: '18px',
                      padding: '12px',
                      border: '4px solid #7b5528',
                      display: 'block',
                      margin: '0 auto 12px',
                      maxWidth: '100%',
                    }}
                  />
                  <p style={{ color: '#6a5035', fontSize: '13px', lineHeight: 1.7 }}>Show this QR at the registration desk for check-in.</p>
                </div>
              </div>
            </div>

            <div className="board-panel" style={{ padding: '24px' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="section-kicker" style={{ marginBottom: '10px' }}>
                  Do Not Miss
                </p>
                {scheduleHighlights.map((event, index) => (
                  <div
                    key={event.title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1fr',
                      gap: '14px',
                      padding: '10px 0',
                      borderBottom: index < scheduleHighlights.length - 1 ? '1px solid rgba(107, 61, 28, 0.12)' : 'none',
                    }}
                  >
                    <span style={{ color: '#7a5c3a', fontFamily: 'DM Mono, monospace', fontSize: '12px', paddingTop: '3px' }}>{event.time}</span>
                    <p style={{ color: '#4d2d16', fontSize: '14px', lineHeight: 1.65 }}>{event.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/location" className="wood-button">
                View Venue
              </Link>
              <button
                onClick={() => {
                  setData(null)
                  setReservationId('')
                }}
                className="wood-button alt"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
