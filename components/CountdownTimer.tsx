'use client'

import { CalendarDays, Clock3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  expired: boolean
}

type CountdownTimerProps = {
  targetDate: string
}

const units = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
] as const

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime()
  const diff = target - Date.now()

  if (!Number.isFinite(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalSeconds: Math.floor(diff / 1000),
    expired: false,
  }
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(targetDate))

    update()
    const intervalId = window.setInterval(update, 1000)

    return () => window.clearInterval(intervalId)
  }, [targetDate])

  const displayDate = useMemo(() => {
    const date = new Date(targetDate)

    if (!Number.isFinite(date.getTime())) {
      return 'Set NEXT_PUBLIC_COUNTDOWN_TARGET'
    }

    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }, [targetDate])

  const progress = useMemo(() => {
    if (!timeLeft) return 0
    if (timeLeft.expired) return 100

    const thirtyDays = 30 * 24 * 60 * 60
    return Math.max(6, Math.min(100, Math.round(100 - (timeLeft.totalSeconds / thirtyDays) * 100)))
  }, [timeLeft])

  return (
    <div className="countdown-panel animate-in">
      <div className="countdown-content">
        <div className="countdown-copy">
          <div className="countdown-badge">
            <Clock3 size={16} aria-hidden="true" />
            <span>Countdown</span>
          </div>
          <h2 className="board-title countdown-title">
            {timeLeft?.expired ? 'The adventure has started' : 'The game starts in'}
          </h2>
          <div className="countdown-date">
            <CalendarDays size={16} aria-hidden="true" />
            <span>{displayDate}</span>
          </div>
        </div>

        <div className="countdown-grid" aria-live="polite">
          {units.map(([key, label]) => (
            <div key={key} className="countdown-tile">
              <p className="countdown-value">{timeLeft ? String(timeLeft[key]).padStart(2, '0') : '--'}</p>
              <p className="section-kicker countdown-label">{label}</p>
            </div>
          ))}
        </div>

        <div className="countdown-track" aria-hidden="true">
          <div className="countdown-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
