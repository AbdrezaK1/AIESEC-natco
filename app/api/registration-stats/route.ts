import { unstable_noStore as noStore } from 'next/cache'
import { NextResponse } from 'next/server'
import { getRegistrationStats } from '@/lib/registrationStats'

export async function GET() {
  noStore()

  const stats = await getRegistrationStats()

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
