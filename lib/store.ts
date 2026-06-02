// In-memory store (persists during server lifetime)
// In production, replace with a real DB (Prisma + PostgreSQL, etc.)

export interface Reservation {
  id: string
  privacyCertified: boolean
  fullName: string
  wellbeing: string
  age: string
  email: string
  phone: string
  facebookLink: string
  funFact: string
  pictureName: string
  pictureType: string
  pictureDataUrl: string
  lc: string // Local Committee
  department: string
  position: string
  excitement: string
  attendedNationalConference: string
  differently: string
  expectations: string
  allergies: string
  comfort: string
  comingFor: string
  feeAgreement: boolean
  qrCodeDataUrl: string
  createdAt: string
}

export interface GossipPost {
  id: string
  content: string
  tag: string
  likes: number
  createdAt: string
}

export interface Wish {
  id: string
  authorName: string
  recipientName: string
  message: string
  emoji: string
  createdAt: string
}

// Global stores
const store = {
  reservations: [] as Reservation[],
  gossip: [
    { id: '1', content: 'Someone forgot their AIESEC badge and used a sticky note with their name on it. Commitment.', tag: 'Classic', likes: 14, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: '2', content: 'The VP of Finance was spotted doing the macarena at 2am. No further context.', tag: 'Night Life', likes: 28, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: '3', content: 'LC from the South brought homemade harissa for the whole delegation. Absolute legends.', tag: 'Food', likes: 42, createdAt: new Date(Date.now() - 3600000 * 8).toISOString() },
  ] as GossipPost[],
  wishes: [
    { id: '1', authorName: 'Rania B.', recipientName: 'Hela T.', message: 'You are going to absolutely crush your presentation. So proud of you!', emoji: '🌟', createdAt: new Date(Date.now() - 3600000 * 1).toISOString() },
    { id: '2', authorName: 'Karim M.', recipientName: 'All Delegates', message: "May this NatCo bring us closer together and remind us why we chose AIESEC. Let's make history.", emoji: '💙', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
    { id: '3', authorName: 'Sarah A.', recipientName: 'Constantine LC', message: "The road trip was worth it! See you on the dance floor, fam.", emoji: '🔥', createdAt: new Date(Date.now() - 3600000 * 6).toISOString() },
  ] as Wish[],
}

export function getStore() { return store }
