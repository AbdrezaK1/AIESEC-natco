# JUMANCO Conference App

A Next.js web app for the AIESEC national conference experience.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with conference overview and quick routes |
| Seat Registration | `/seat` | Delegate registration with QR pass generation |
| Venue and Schedule | `/location` | Venue details, facilities, travel notes, and schedule |
| Gossip Wall | `/gossip` | Anonymous campfire stories with reactions |
| Wishes Board | `/wishes` | Positive messages between delegates |
| My Profile | `/profile` | Reservation lookup and QR check-in pass |
| Admin Dashboard | `/admin` | Registration list, stats, and CSV export |

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS with custom global styling
- In-memory local store

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The app currently stores data in `lib/store.ts`, so it is not persistent in production yet.
- `.env.local`, `.next`, and `node_modules` are ignored and are not included in Git.
