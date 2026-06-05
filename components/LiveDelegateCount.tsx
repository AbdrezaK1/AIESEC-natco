'use client'

import { useEffect, useState } from 'react'

type LiveDelegateCountProps = {
  initialCount: number
}

type RegistrationStatsResponse = {
  totalDelegates?: unknown
}

const refreshIntervalMs = 15000

export default function LiveDelegateCount({ initialCount }: LiveDelegateCountProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    let cancelled = false

    async function loadCount() {
      try {
        const response = await fetch('/api/registration-stats', { cache: 'no-store' })

        if (!response.ok) return

        const data = (await response.json()) as RegistrationStatsResponse
        const nextCount = Number(data.totalDelegates)

        if (!cancelled && Number.isFinite(nextCount)) {
          setCount(nextCount)
        }
      } catch {
        // Keep the server-rendered number if the live refresh is temporarily unavailable.
      }
    }

    loadCount()

    const interval = window.setInterval(loadCount, refreshIntervalMs)
    window.addEventListener('focus', loadCount)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.removeEventListener('focus', loadCount)
    }
  }, [])

  return <span aria-live="polite">{count}</span>
}
