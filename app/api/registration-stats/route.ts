import { NextResponse } from 'next/server'
import { getRegistrationStats } from '@/lib/registrationStats'

export async function GET() {
  const stats = await getRegistrationStats()

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
    },
  })
}
