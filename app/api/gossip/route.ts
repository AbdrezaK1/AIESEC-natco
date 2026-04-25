import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET() {
  const store = getStore()
  return NextResponse.json(store.gossip.slice().reverse())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const store = getStore()

  const post = {
    id: Date.now().toString(),
    content: body.content?.slice(0, 280),
    tag: body.tag || 'Tea ☕',
    likes: 0,
    createdAt: new Date().toISOString(),
  }

  store.gossip.push(post)
  return NextResponse.json(post)
}
