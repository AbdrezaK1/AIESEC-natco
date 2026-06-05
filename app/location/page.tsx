import Link from 'next/link'

const schedule = [
  {
    day: 'Day 1',
    date: 'July 18',
    events: [
      { time: '09:00', title: 'Registration and welcome kit', type: 'Admin' },
      { time: '11:00', title: 'Opening ceremony', type: 'Plenary' },
      { time: '14:00', title: 'National strategy unveiling', type: 'Plenary' },
      { time: '17:00', title: 'LC showcase round 1', type: 'Workshop' },
      { time: '20:00', title: 'Welcome dinner and networking', type: 'Social' },
    ],
  },
  {
    day: 'Day 2',
    date: 'July 19',
    events: [
      { time: '09:00', title: 'Morning energizer', type: 'Social' },
      { time: '10:00', title: 'Functional deep dives', type: 'Workshop' },
      { time: '14:00', title: 'Leadership panel', type: 'Plenary' },
      { time: '16:30', title: 'Hackathon: AIESEC 2030', type: 'Workshop' },
      { time: '21:00', title: 'Jungle night rally', type: 'Social' },
    ],
  },
  {
    day: 'Day 3',
    date: 'July 20',
    events: [
      { time: '09:00', title: 'Solutions presentations', type: 'Plenary' },
      { time: '11:00', title: 'Awards and recognition', type: 'Plenary' },
      { time: '13:00', title: 'Closing ceremony', type: 'Plenary' },
      { time: '15:00', title: 'Farewell lunch', type: 'Social' },
    ],
  },
]

const typeColors: Record<string, { bg: string; color: string }> = {
  Plenary: { bg: 'rgba(255, 212, 45, 0.2)', color: '#7a4d0f' },
  Workshop: { bg: 'rgba(126, 162, 79, 0.18)', color: '#496632' },
  Social: { bg: 'rgba(196, 81, 40, 0.18)', color: '#8b3f20' },
  Admin: { bg: 'rgba(107, 61, 28, 0.08)', color: '#6a3416' },
}

const facilities = [
  { label: 'Main Auditorium', detail: '500 seats' },
  { label: 'Workshop Rooms', detail: '6 rooms x 60 seats' },
  { label: 'Exhibition Hall', detail: 'LC booths and activations' },
  { label: 'Cafeteria', detail: '3 meals each day' },
  { label: 'Prayer Room', detail: 'Available 24/7' },
  { label: 'Accommodation', detail: 'On-site hostel' },
]

const travelNotes = [
  { method: 'By Air', detail: 'Houari Boumediene Airport to the venue takes around 30 minutes by taxi.' },
  { method: 'By Metro', detail: 'Use the closest available metro stop, then continue by taxi to the hotel.' },
  { method: 'By Car', detail: 'Use the Google Maps link for the most accurate route and parking details.' },
  { method: 'By Bus', detail: 'Lines 25, 81, and 103 stop close to the venue.' },
]

export default function LocationPage() {
  return (
    <div className="paper-page">
      <div className="paper-container">
        <div className="animate-in" style={{ marginBottom: '26px' }}>
          <p className="section-kicker" style={{ marginBottom: '10px' }}>
            Conference Venue
          </p>
          <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 56px)', marginBottom: '12px' }}>
            Venue, routes, and the full schedule board.
          </h1>
          <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8 }}>
            June 25-27, 2026. Hôtel Meddouda El-Djamil, Algeria.
          </p>
        </div>

        <section className="board-panel animate-in float-board" style={{ padding: '28px', marginBottom: '22px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                height: '300px',
                borderRadius: '24px',
                border: '3px solid rgba(107, 61, 28, 0.18)',
                background:
                  'linear-gradient(135deg, rgba(255, 249, 236, 0.95) 0%, rgba(235, 214, 166, 0.85) 100%)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(106, 52, 22, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(106, 52, 22, 0.06) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 900 300" fill="none">
                <path d="M0 150H900" stroke="rgba(196, 81, 40, 0.12)" strokeWidth="14" />
                <path d="M460 0V300" stroke="rgba(126, 162, 79, 0.14)" strokeWidth="10" />
                <path d="M180 0V300" stroke="rgba(106, 52, 22, 0.08)" strokeWidth="5" />
                <path d="M700 0V300" stroke="rgba(106, 52, 22, 0.08)" strokeWidth="5" />
                <circle cx="460" cy="150" r="22" fill="rgba(255, 212, 45, 0.28)" stroke="#6a3416" strokeWidth="3" />
                <circle cx="460" cy="150" r="8" fill="#c45128" />
                <circle cx="460" cy="150" r="38" stroke="rgba(106, 52, 22, 0.2)" strokeWidth="3" strokeDasharray="7 7" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  background: 'rgba(255, 248, 232, 0.86)',
                  border: '4px solid #6a3416',
                  borderRadius: '22px',
                  padding: '18px 22px',
                  boxShadow: '0 10px 20px rgba(74, 35, 15, 0.12)',
                }}
              >
                <p className="section-kicker" style={{ marginBottom: '6px' }}>
                  Basecamp
                </p>
                <p className="board-title" style={{ fontSize: '24px', marginBottom: '4px' }}>
                  Hôtel Meddouda El-Djamil
                </p>
                <p style={{ color: '#6a5035', fontSize: '13px' }}>Open the map for the exact route</p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: '18px',
                alignItems: 'start',
              }}
              className="hero-grid"
            >
              <div>
                <h2 className="board-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
                  Hôtel Meddouda El-Djamil
                </h2>
                <p style={{ color: '#5f4930', fontSize: '15px', lineHeight: 1.8, marginBottom: '14px' }}>
                  The conference board is centered at Hôtel Meddouda El-Djamil with enough space for plenaries, workshops, accommodation, meals, and delegation movement without losing the shared atmosphere.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Free WiFi', 'Prayer room', 'On-site dining', 'Shuttle service'].map((tag) => (
                    <span key={tag} className="board-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/YxjNV24A6anUAdG97"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wood-button"
                >
                  Open In Maps
                </a>
                <Link href="/seat" className="wood-button alt">
                  Reserve Seat
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="board-panel animate-in" style={{ padding: '26px', marginBottom: '22px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Facilities
            </p>
            <h2 className="board-title" style={{ fontSize: '32px', marginBottom: '18px' }}>
              What the venue includes
            </h2>
            <div className="board-grid">
              {facilities.map((facility) => (
                <div key={facility.label} className="metric-card">
                  <p className="board-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                    {facility.label}
                  </p>
                  <p style={{ color: '#6a5035', fontSize: '14px', lineHeight: 1.7 }}>{facility.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="schedule" className="board-panel animate-in" style={{ padding: '26px', scrollMarginTop: '120px', marginBottom: '22px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <div>
                <p className="section-kicker" style={{ marginBottom: '10px' }}>
                  Schedule
                </p>
                <h2 className="board-title" style={{ fontSize: '32px' }}>
                  Conference timeline
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'flex-start' }}>
                {Object.entries(typeColors).map(([label, item]) => (
                  <span
                    key={label}
                    className="tag"
                    style={{
                      background: item.bg,
                      color: item.color,
                      border: '2px solid rgba(107, 61, 28, 0.1)',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
              {schedule.map((day) => (
                <div key={day.day} className="metric-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div
                    style={{
                      padding: '18px 20px',
                      background: 'rgba(255,255,255,0.36)',
                      borderBottom: '2px solid rgba(107, 61, 28, 0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <p className="board-title" style={{ fontSize: '24px' }}>
                      {day.day}
                    </p>
                    <p className="section-kicker" style={{ color: '#7c5a33' }}>
                      {day.date}
                    </p>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    {day.events.map((event, index) => (
                      <div
                        key={`${day.day}-${event.time}`}
                        className="schedule-row"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '56px 1fr auto',
                          gap: '12px',
                          alignItems: 'start',
                          padding: '12px 4px',
                          borderBottom: index < day.events.length - 1 ? '1px solid rgba(107, 61, 28, 0.12)' : 'none',
                        }}
                      >
                        <span style={{ color: '#7a5c3a', fontFamily: 'DM Mono, monospace', fontSize: '12px', paddingTop: '3px' }}>{event.time}</span>
                        <p style={{ color: '#4d2d16', fontSize: '14px', lineHeight: 1.65 }}>{event.title}</p>
                        <span
                          className="tag"
                          style={{
                            background: typeColors[event.type].bg,
                            color: typeColors[event.type].color,
                            border: '2px solid rgba(107, 61, 28, 0.08)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {event.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="board-panel animate-in" style={{ padding: '26px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Travel Notes
            </p>
            <h2 className="board-title" style={{ fontSize: '32px', marginBottom: '18px' }}>
              Getting there
            </h2>
            <div className="board-grid">
              {travelNotes.map((note) => (
                <div key={note.method} className="metric-card">
                  <p className="board-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                    {note.method}
                  </p>
                  <p style={{ color: '#6a5035', fontSize: '14px', lineHeight: 1.75 }}>{note.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
