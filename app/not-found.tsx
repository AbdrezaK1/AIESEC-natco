import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      paddingTop: '64px', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '80px 24px',
    }}>
      <div className="animate-in">
        <p style={{
          fontSize: '96px', fontWeight: '600', letterSpacing: '-4px',
          color: 'var(--bg-card)', lineHeight: '1',
          textShadow: '0 0 0 1px var(--border)',
          WebkitTextStroke: '1px var(--border)',
          marginBottom: '24px',
        }}>404</p>
        <h1 style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '12px' }}>Page not found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          This page doesn't exist or has been moved.
        </p>
        <Link href="/" style={{
          padding: '12px 24px', borderRadius: '10px', background: 'var(--aiesec-blue)',
          color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500',
        }}>← Back to Home</Link>
      </div>
    </div>
  )
}
