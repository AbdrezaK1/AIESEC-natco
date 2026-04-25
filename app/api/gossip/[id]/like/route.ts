import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const store = getStore()
  const post = store.gossip.find(p => p.id === params.id)
  if (post) post.likes++
  return NextResponse.json({ ok: true })
}
