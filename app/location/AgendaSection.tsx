'use client'

import { useState } from 'react'

const TRACKS = [
  { id: 'all',     label: 'All Tracks',    emoji: '📋' },
  { id: 'members', label: 'Members',       emoji: '🌱' },
  { id: 'tl',      label: 'TL & Managers', emoji: '🏕️' },
  { id: 'lcps',    label: 'VPs & LCPs',   emoji: '🏔️' },
] as const

type TrackId = typeof TRACKS[number]['id']

const TYPE_META: Record<string, { label: string; dot: string; bg: string; color: string }> = {
  logistics: { label: 'Logistics', dot: '#9890a8', bg: 'rgba(152,144,168,0.14)', color: '#5a5270' },
  ceremony:  { label: 'Ceremony',  dot: '#ffd42d', bg: 'rgba(255,212,45,0.18)',  color: '#8c5c10' },
  plenary:   { label: 'Plenary',   dot: '#c45128', bg: 'rgba(196,81,40,0.13)',   color: '#7a2e10' },
  social:    { label: 'Social',    dot: '#e76640', bg: 'rgba(231,102,64,0.13)',  color: '#8c3d18' },
  break:     { label: 'Break',     dot: '#b89860', bg: 'rgba(184,152,96,0.13)', color: '#7a6040' },
  parallel:  { label: 'Parallel',  dot: '#7ea24f', bg: 'rgba(79,122,74,0.15)',  color: '#2e5229' },
}

interface SingleSession {
  id: string
  startTime: string
  endTime: string
  emoji: string
  title: string
  type: keyof typeof TYPE_META
  tracks: TrackId[]
}

interface ParallelBlock {
  id: string
  startTime: string
  endTime: string
  type: 'parallel'
  tracks: TrackId[]
  items: { emoji: string; title: string; tracks: TrackId[] }[]
}

type AnySession = SingleSession | ParallelBlock

function isParallel(s: AnySession): s is ParallelBlock {
  return s.type === 'parallel'
}

const DAY1: AnySession[] = [
  {
    id: 'arrival',
    startTime: '08:00',
    endTime: '14:30',
    emoji: '🚌',
    title: 'Arrival & Check-in',
    type: 'logistics',
    tracks: ['all'],
  },
  {
    id: 'opening',
    startTime: '14:30',
    endTime: '16:30',
    emoji: '🚪',
    title: 'Opening Ceremony',
    type: 'ceremony',
    tracks: ['all'],
  },
  {
    id: 'essence',
    startTime: '16:30',
    endTime: '17:30',
    emoji: '✨',
    title: 'Essence',
    type: 'plenary',
    tracks: ['all'],
  },
  {
    id: 'break',
    startTime: '17:30',
    endTime: '17:45',
    emoji: '☕',
    title: 'Break',
    type: 'break',
    tracks: ['all'],
  },
  {
    id: 'algeria2030',
    startTime: '17:45',
    endTime: '18:30',
    emoji: '🌍',
    title: 'Algeria 2030',
    type: 'plenary',
    tracks: ['all'],
  },
  {
    id: 'leadership-parallel',
    startTime: '18:30',
    endTime: '19:15',
    type: 'parallel',
    tracks: ['all'],
    items: [
      { emoji: '💡', title: 'Lead From Within',                          tracks: ['members', 'tl'] },
      { emoji: '🎭', title: 'Behind the Mask: The Real Leadership Journey', tracks: ['lcps'] },
    ],
  },
  {
    id: 'chairspace',
    startTime: '19:15',
    endTime: '20:00',
    emoji: '🪑',
    title: 'Chair Space',
    type: 'plenary',
    tracks: ['all'],
  },
  {
    id: 'closing-plenary',
    startTime: '20:00',
    endTime: '20:15',
    emoji: '🎤',
    title: 'Closing Plenary',
    type: 'plenary',
    tracks: ['all'],
  },
  {
    id: 'family-feud',
    startTime: '20:15',
    endTime: '21:30',
    emoji: '🇩🇿',
    title: 'Open Algeria',
    type: 'social',
    tracks: ['all'],
  },
]

function sessionVisible(s: AnySession, track: TrackId): boolean {
  if (track === 'all') return true
  if (isParallel(s)) return s.items.some(i => i.tracks.includes('all') || i.tracks.includes(track))
  return s.tracks.includes('all') || s.tracks.includes(track)
}

export default function AgendaSection() {
  const [track, setTrack] = useState<TrackId>('all')
  const visible = DAY1.filter(s => sessionVisible(s, track))

  return (
    <section id="schedule" style={{ scrollMarginTop: '120px' }}>

      {/* Header + track filter */}
      <div style={{ marginBottom: '22px' }}>
        <p className="section-kicker" style={{ marginBottom: '8px' }}>Day 1 — June 25, 2026</p>
        <h2 className="board-title" style={{ fontSize: 'clamp(24px, 3.8vw, 38px)', marginBottom: '16px' }}>
          The Main Stage
        </h2>

        <div style={{ marginBottom: '6px' }}>
          <p style={{ fontSize: '12px', color: '#8d7559', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Filter by track
          </p>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            {TRACKS.map(t => (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                style={{
                  padding: '7px 13px',
                  borderRadius: '999px',
                  border: `2px solid ${track === t.id ? '#6a3416' : 'rgba(107,61,28,0.2)'}`,
                  background: track === t.id ? 'linear-gradient(180deg,#ffd42d,#e7a81d)' : 'rgba(255,248,232,0.7)',
                  color: track === t.id ? '#3f1f0a' : '#6b4a28',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.16s ease',
                  boxShadow: track === t.id ? '0 3px 0 rgba(140,82,28,0.4)' : 'none',
                  transform: track === t.id ? 'translateY(-1px)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '79px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: 'linear-gradient(180deg, rgba(107,61,28,0.06), rgba(107,61,28,0.18) 30%, rgba(107,61,28,0.18) 70%, rgba(107,61,28,0.06))',
          borderRadius: '999px',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {visible.map(session =>
            isParallel(session)
              ? <ParallelRow key={session.id} block={session} track={track} />
              : <SessionRow key={session.id} session={session} />
          )}
        </div>
      </div>
    </section>
  )
}

function SessionRow({ session }: { session: SingleSession }) {
  const meta = TYPE_META[session.type]
  const isBreak = session.type === 'break'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 12px', alignItems: 'start' }}>
      {/* Time column */}
      <div style={{ paddingTop: isBreak ? '8px' : '14px', textAlign: 'right', paddingRight: '14px', position: 'relative', zIndex: 1 }}>
        <span style={{
          position: 'absolute',
          right: '-1px',
          top: isBreak ? '13px' : '19px',
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: meta.dot,
          border: '2px solid rgba(255,248,232,0.9)',
          boxShadow: `0 0 0 2px ${meta.dot}44`,
          transform: 'translateX(50%)',
        }} />
        <span style={{
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#8d7559',
          display: 'block',
          lineHeight: 1,
        }}>{session.startTime}</span>
        {!isBreak && (
          <span style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: '10px',
            color: '#b0956f',
            display: 'block',
            marginTop: '2px',
          }}>→ {session.endTime}</span>
        )}
      </div>

      {/* Card */}
      {isBreak ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px 18px',
          borderRadius: '12px',
          background: 'rgba(255,244,210,0.92)',
          border: '2px dashed rgba(140,100,50,0.45)',
        }}>
          <span style={{ fontSize: '18px' }}>{session.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: '14px', color: meta.color, letterSpacing: '0.04em' }}>{session.title}</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(184,152,96,0.18)',
            border: '1px solid rgba(184,152,96,0.3)',
            fontSize: '11px',
            fontWeight: 600,
            color: meta.color,
          }}>15 min</span>
        </div>
      ) : (
        <div style={{
          padding: '13px 16px',
          borderRadius: '16px',
          border: '2px solid rgba(107,61,28,0.13)',
          background: 'rgba(255,248,232,0.78)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1 }}>{session.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#4a230f', lineHeight: 1.3, flex: '1 1 120px', minWidth: 0 }}>
              {session.title}
            </span>
            <span style={{
              padding: '3px 8px',
              borderRadius: '999px',
              background: meta.bg,
              color: meta.color,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              flexShrink: 0,
              marginLeft: 'auto',
            }}>
              ● {meta.label}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function ParallelRow({ block, track }: { block: ParallelBlock; track: TrackId }) {
  const visibleItems = track === 'all'
    ? block.items
    : block.items.filter(i => i.tracks.includes('all') || i.tracks.includes(track))

  const trackName = (ids: TrackId[]) =>
    ids.map(id => TRACKS.find(t => t.id === id)?.label ?? id).join(', ')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 12px', alignItems: 'start' }}>
      {/* Time */}
      <div style={{ paddingTop: '14px', textAlign: 'right', paddingRight: '14px', position: 'relative', zIndex: 1 }}>
        <span style={{
          position: 'absolute',
          right: '-1px',
          top: '19px',
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: '#7ea24f',
          border: '2px solid rgba(255,248,232,0.9)',
          boxShadow: '0 0 0 2px rgba(126,162,79,0.3)',
          transform: 'translateX(50%)',
        }} />
        <span style={{
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#8d7559',
          display: 'block',
          lineHeight: 1,
        }}>{block.startTime}</span>
        <span style={{
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: '10px',
          color: '#b0956f',
          display: 'block',
          marginTop: '2px',
        }}>→ {block.endTime}</span>
      </div>

      {/* Cards side by side */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '7px',
          padding: '3px 9px',
          borderRadius: '999px',
          background: 'rgba(79,122,74,0.12)',
          border: '1px solid rgba(79,122,74,0.22)',
        }}>
          <span style={{ fontSize: '10px', color: '#3a6635', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ⚡ Parallel sessions
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: visibleItems.length > 1 ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr',
          gap: '8px',
        }}>
          {visibleItems.map((item, i) => {
            const isHighlighted = track !== 'all' && (item.tracks.includes('all') || item.tracks.includes(track))
            return (
              <div
                key={i}
                style={{
                  padding: '13px 15px',
                  borderRadius: '16px',
                  border: isHighlighted ? '2px solid rgba(79,122,74,0.36)' : '2px solid rgba(79,122,74,0.2)',
                  background: isHighlighted ? 'rgba(238,252,236,0.88)' : 'rgba(245,252,244,0.72)',
                  boxShadow: isHighlighted ? '0 4px 12px rgba(79,122,74,0.12)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#2a4d28', lineHeight: 1.35 }}>
                    {item.title}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#5a7a50', fontWeight: 600, letterSpacing: '0.03em' }}>
                  {trackName(item.tracks)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
