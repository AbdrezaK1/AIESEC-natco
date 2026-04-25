# AIESEC NatCo 2025 — Web App

A full-stack Next.js web app for the AIESEC National Conference.

## Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, stats, feature cards |
| Seat Reservation | `/seat` | 2-step form to register delegates |
| Venue & Location | `/location` | Map, facilities, schedule, directions |
| Gossip Wall | `/gossip` | Anonymous posts with tags & fire reactions |
| Wishes Board | `/wishes` | Signed messages between delegates |
| My Profile | `/profile` | Lookup reservation by ID |
| Admin Dashboard | `/admin` | View all registrations, stats, export CSV |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS variables
- **Data**: In-memory store (replace with DB for production)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Project Structure

```
app/
  page.tsx          → Home
  seat/             → Seat reservation form
  location/         → Venue & schedule
  gossip/           → Anonymous gossip wall
  wishes/           → Wishes board
  profile/          → Delegate profile lookup
  admin/            → Admin dashboard
  api/
    reserve/        → POST/GET reservations
    gossip/         → POST/GET gossip posts
    gossip/[id]/like → POST like
    wishes/         → POST/GET wishes
components/
  Navbar.tsx
lib/
  store.ts          → In-memory data store
```

## Production Setup

For production, replace `lib/store.ts` with a real database:

### Option A — Prisma + PostgreSQL (recommended)
```bash
npm install prisma @prisma/client
npx prisma init
```

### Option B — Supabase (quick & free)
```bash
npm install @supabase/supabase-js
```

### Option C — MongoDB
```bash
npm install mongoose
```

## Customization

- **Conference name/dates**: Edit `app/page.tsx` and `app/location/page.tsx`
- **LCs list**: Edit the `algerianLCs` array in `app/seat/page.tsx`
- **Colors**: Edit CSS variables in `app/globals.css`
- **Admin route**: Add auth middleware to protect `/admin`

## Environment Variables (for production)

```env
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_MAPS_KEY=...
```

---

Built with 💙 for the AIESEC movement
