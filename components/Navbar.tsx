'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

const navLinks = [
  { href: '/', label: 'Camp' },
  { href: '/seat', label: 'Registration' },
  { href: '/location', label: 'Map' },
  { href: '/location#schedule', label: 'Schedule' },
  { href: '/gossip', label: 'Campfire' },
  { href: '/wishes', label: 'Totems' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const activePath = useMemo(() => {
    if (pathname.startsWith('/location')) return '/location'
    return pathname
  }, [pathname])

  return (
    <nav
      style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        zIndex: 100,
        padding: '12px 16px 0',
      }}
    >
      <div
        className="board-panel"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '16px 22px',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                border: '4px solid #6a3416',
                boxShadow: '0 6px 0 #8c521c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a230f',
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '24px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              J
            </div>
            <div style={{ minWidth: 0 }}>
              <span
                className="logo-wordmark"
                style={{
                  display: 'block',
                  fontSize: '28px',
                  WebkitTextStroke: '3px #6a3416',
                  textShadow: '0 5px 0 #8d4a1d, 0 12px 18px rgba(77, 37, 16, 0.18)',
                }}
              >
                Jumanco
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: '2px',
                  color: '#7a5934',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                National Conference
              </span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
            {navLinks.map((link) => {
              const active = link.href.startsWith('/location') ? activePath === '/location' : activePath === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: active ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.1)',
                    background: active ? 'linear-gradient(180deg, #ffd72f, #e7a81d)' : 'rgba(255, 255, 255, 0.38)',
                    color: active ? '#4a230f' : '#6f4a28',
                    boxShadow: active ? '0 6px 0 #8c521c' : 'none',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/seat" className="wood-button hide-mobile">
              Join The Quest
            </Link>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              className="show-mobile"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                border: '3px solid #6a3416',
                background: 'linear-gradient(180deg, #fff6df, #efd9ac)',
                color: '#4a230f',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {menuOpen ? (
                  <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <>
                    <rect x="2" y="4" width="14" height="2" rx="1" fill="currentColor" />
                    <rect x="2" y="8" width="14" height="2" rx="1" fill="currentColor" />
                    <rect x="2" y="12" width="14" height="2" rx="1" fill="currentColor" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gap: '10px',
              marginTop: '14px',
            }}
            className="show-mobile"
          >
            {navLinks.map((link) => {
              const active = link.href.startsWith('/location') ? activePath === '/location' : activePath === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '12px 14px',
                    borderRadius: '18px',
                    border: active ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.12)',
                    background: active ? 'linear-gradient(180deg, #ffd72f, #e7a81d)' : 'rgba(255, 255, 255, 0.38)',
                    color: active ? '#4a230f' : '#6f4a28',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>

      <style>{`
        @media (max-width: 980px) {
          .desktop-nav { display: none !important; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 981px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
