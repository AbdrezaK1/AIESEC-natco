'use client'
import { useEffect, useState } from 'react'

const emojis = ['Blue Heart', 'Star', 'Fire', 'Sparkle', 'Target', 'Lion', 'Rocket', 'Strength', 'Globe', 'Party']

const emojiMap: Record<string, string> = {
  'Blue Heart': 'BH',
  Star: 'ST',
  Fire: 'FR',
  Sparkle: 'SP',
  Target: 'TG',
  Lion: 'LN',
  Rocket: 'RK',
  Strength: 'PW',
  Globe: 'GB',
  Party: 'PT',
}

interface Wish {
  id: string
  authorName: string
  recipientName: string
  message: string
  emoji: string
  createdAt: string
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [form, setForm] = useState({ authorName: '', recipientName: '', message: '', emoji: 'Blue Heart' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [justPosted, setJustPosted] = useState('')

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes')
      const data = await res.json()
      setWishes(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishes()
  }, [])

  const handleSubmit = async () => {
    if (!form.authorName.trim() || !form.recipientName.trim() || !form.message.trim()) return
    setSubmitting(true)
    try {
      const payload = { ...form, emoji: form.emoji }
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const newWish = await res.json()
      setWishes((prev) => [newWish, ...prev])
      setJustPosted(newWish.id)
      setForm({ authorName: '', recipientName: '', message: '', emoji: 'Blue Heart' })
      setTimeout(() => setJustPosted(''), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const isValid = form.authorName.trim() && form.recipientName.trim() && form.message.trim().length >= 10

  return (
    <div className="paper-page">
      <div className="paper-container" style={{ maxWidth: '980px' }}>
        <div className="animate-in" style={{ marginBottom: '24px' }}>
          <p className="section-kicker" style={{ marginBottom: '10px' }}>
            Community Totem
          </p>
          <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 54px)', marginBottom: '12px' }}>
            Wishes Board
          </h1>
          <p style={{ color: '#5f4930', fontSize: '16px', lineHeight: 1.8 }}>
            Leave a message that someone can carry through the conference. Gratitude, support, and little sparks all belong here.
          </p>
        </div>

        <div className="board-panel animate-in" style={{ padding: '28px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Add A Wish
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }} className="hero-grid">
              <div>
                <label className="section-kicker" style={{ display: 'block', marginBottom: '8px' }}>
                  Your Name
                </label>
                <input value={form.authorName} onChange={(event) => setForm((prev) => ({ ...prev, authorName: event.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="section-kicker" style={{ display: 'block', marginBottom: '8px' }}>
                  Recipient
                </label>
                <input
                  value={form.recipientName}
                  onChange={(event) => setForm((prev) => ({ ...prev, recipientName: event.target.value }))}
                  placeholder="Delegate name or all delegates"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="section-kicker" style={{ display: 'block', marginBottom: '8px' }}>
                Your Wish
              </label>
              <textarea
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                rows={4}
                placeholder="Write your message, support note, or good energy..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label className="section-kicker" style={{ display: 'block', marginBottom: '8px' }}>
                  Totem Mark
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {emojis.map((item) => (
                    <button
                      key={item}
                      onClick={() => setForm((prev) => ({ ...prev, emoji: item }))}
                      className="board-chip"
                      style={{
                        minWidth: '54px',
                        background: form.emoji === item ? 'rgba(255, 212, 45, 0.45)' : 'rgba(255,255,255,0.4)',
                        border: form.emoji === item ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.12)',
                      }}
                    >
                      {emojiMap[item]}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={!isValid || submitting} className="wood-button">
                {submitting ? 'Sending...' : 'Send Wish'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="board-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1, color: '#7b5b36' }}>Loading wishes...</div>
          </div>
        ) : wishes.length === 0 ? (
          <div className="board-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="board-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
                Empty Totem
              </p>
              <p style={{ color: '#6a5035' }}>No wishes yet. The first message sets the tone.</p>
            </div>
          </div>
        ) : (
          <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="board-panel animate-in card-hover"
                style={{
                  padding: '22px',
                  background:
                    justPosted === wish.id
                      ? 'radial-gradient(circle at top, rgba(255,255,255,0.45), transparent 26%), linear-gradient(180deg, #fff3cf 0%, #ead8b1 100%)'
                      : undefined,
                }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.38)',
                        border: '3px solid rgba(107, 61, 28, 0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6a3416',
                        fontWeight: 700,
                      }}
                    >
                      {emojiMap[wish.emoji] || 'TW'}
                    </div>
                    <span style={{ color: '#8a6f51', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>{timeAgo(wish.createdAt)}</span>
                  </div>

                  <p className="section-kicker" style={{ marginBottom: '8px' }}>
                    To {wish.recipientName}
                  </p>
                  <p style={{ color: '#4d2d16', fontSize: '14px', lineHeight: 1.8, marginBottom: '16px' }}>{wish.message}</p>

                  <div style={{ borderTop: '1px solid rgba(107, 61, 28, 0.12)', paddingTop: '12px' }}>
                    <p style={{ color: '#6a5035', fontSize: '13px' }}>
                      From <strong>{wish.authorName}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
