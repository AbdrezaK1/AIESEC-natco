import Link from 'next/link'



export default function LocationPage() {
  return (
    <div className="paper-page">
      <div className="paper-container">
        <div className="animate-in" style={{ marginBottom: '26px' }}>
          <p className="section-kicker" style={{ marginBottom: '10px' }}>
            Conference Venue
          </p>
          <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 56px)', marginBottom: '12px' }}>
            Venue,and schedule updates.
          </h1>
          <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8 }}>
            June 25-27, 2026. Complexe el Mountazeh, Mostaganem, Algeria.
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
                 Complexe el Mountazeh
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
                  Complexe el Mountazeh
                </h2>
                <p style={{ color: '#5f4930', fontSize: '15px', lineHeight: 1.8, marginBottom: '14px' }}>
                  The conference board is centered at Complexe el Mountazeh with enough space for plenaries, workshops, accommodation, meals, and delegation movement without losing the shared atmosphere.
                </p>
                
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/TjBmKMCshMGbS4hVA"
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

        
        <section id="schedule" className="board-panel animate-in" style={{ padding: '26px', scrollMarginTop: '120px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Schedule
            </p>
            <div className="metric-card" style={{ padding: '28px', textAlign: 'center' }}>
              <p className="board-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
                The conference schedule will be shared after.
              </p>
              <p style={{ color: '#5f4930', fontSize: '15px', lineHeight: 1.8, maxWidth: '620px', margin: '0 auto' }}>
                Keep this checkpoint open. Once the final flow is ready, the full timeline will appear here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
