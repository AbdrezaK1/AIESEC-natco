import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET() {
  const store = getStore()
  return NextResponse.json(store.wishes.slice().reverse())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const store = getStore()

  const wish = {
    id: Date.now().toString(),
    authorName: body.authorName?.slice(0, 60),
    recipientName: body.recipientName?.slice(0, 60),
    message: body.message?.slice(0, 400),
    emoji: body.emoji || '💙',
    createdAt: new Date().toISOString(),
  }

  store.wishes.push(wish)
  return NextResponse.json(wish)
}
