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

## Google Sheets Registration Storage

The `/seat` registration form sends submissions to `/api/reserve`, and that API forwards each reservation to Google Sheets.

1. Create a Google Sheet.
2. In the sheet, open `Extensions` -> `Apps Script`.
3. Paste the code from `google-sheets-apps-script.js`.
4. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the ID from your sheet URL. For `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, copy only `SHEET_ID`.
5. Click `Deploy` -> `New deployment`.
6. Choose `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Authorize the script permissions when Google asks.
10. Copy the Web app URL.
11. Add it to `.env.local`:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Restart `npm run dev` after changing `.env.local`.

If the form fields change, paste the latest `google-sheets-apps-script.js` into Apps Script and deploy a new web app version. The script also saves uploaded smiling pictures to a Google Drive folder named `JumanCO registration pictures` and writes the Drive link into the sheet.

## Countdown Timer

The homepage countdown uses `NEXT_PUBLIC_COUNTDOWN_TARGET`. Add or update it in `.env.local`:

```bash
NEXT_PUBLIC_COUNTDOWN_TARGET=2026-06-15T09:00:00+01:00
```

Restart `npm run dev` after changing the date.

## Notes

- The app also stores data in `lib/store.ts` for local admin features, but Google Sheets is now the persistent registration backup.
- `.env.local`, `.next`, and `node_modules` are ignored and are not included in Git.
