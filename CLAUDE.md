# MEVITE — Claude Project Brief

## What Is MEVITE
MEVITE is a peer-to-peer social utility — the inverse of RSVP platforms. Instead of waiting to be invited, you **invite yourself over**. The sender creates a "Mevite" telling someone they're coming, sets their arrival status, and shares a unique link. The receiver responds (Obviously / Let's adjust the plan / Terrible timing) on a live mission page. No accounts required.

**Tagline:** Invite Yourself Over.
**Live URL:** https://mevite.vercel.app
**Brand color:** `#E8470A` (orange)
**Brand font:** Inter (900 for headlines, 700 for UI, 400 for body)

---

## Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Database:** Firebase Firestore (`mevite` project, `us-east1`)
- **Auth:** Firebase Email/Password (enabled, not yet used in UI)
- **Hosting:** Vercel (`bckr` account, project `mevite`)
- **Repo:** https://github.com/ajbckr/mevite
- **Deploy:** Push to `main` → Vercel auto-deploys via GitHub integration

---

## Credentials & Config
- **Firebase project ID:** `mevite` (project number: 722625133707)
- **Firebase app ID:** `1:722625133707:web:f669d71d92ea823453288e`
- **Vercel project:** `bckr/mevite`
- **GitHub repo:** `ajbckr/mevite`
- **GitHub token:** stored in `/home/claude/.env_mevite` (sandbox only)
- **Env vars:** in `mevite/.env.local` and set in Vercel dashboard

### Firestore Rules (currently open for MVP)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mevites/{id} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
  }
}
```

---

## Routes
| Route | Description |
|-------|-------------|
| `/` | Create a Mevite — form with rotating prompts, date picker, door slider |
| `/share/[id]` | Post-send share page — SMS/email/copy link |
| `/m/[id]` | Live mission page — receiver view + sender view toggle |
| `/m/[id]/adjust` | Suggest a new time (negotiation flow) |

---

## Key Files
```
app/
  page.tsx              — Create page (main form)
  layout.tsx            — Root layout + metadata
  m/[id]/page.tsx       — Mission page (live receiver/sender view)
  m/[id]/adjust/page.tsx — Suggest new time
  share/[id]/page.tsx   — Share page after creating

components/
  DoorSlider.tsx        — "This Is Happening" door slider (5 states)
  DoorSVG.tsx           — Door SVG component (unused, superseded)
  MeviteHeader.tsx      — Sticky header with M lockup (compact version for sub-pages)
  RotatingPrompt.tsx    — Animated rotating placeholder input + WhenField
  ArrivalGauge.tsx      — Arrival status gauge bar + inline picker
  StatusIcons.tsx       — Flat SVG icons for arrival statuses

lib/
  firebase.ts           — Firebase init (exports db, auth)
  mevite.ts             — All Firestore operations
  types.ts              — Types, ArrivalStatus enum, ARRIVAL_STATUSES, prompt arrays

public/
  m-lockup.png          — M icon + MEVITE stacked (hero lockup on create page)
  m-logo.png            — M icon + MEVITE stacked PNG
  m-only.png            — M letterform only (no text)
  door-sprite.png       — (deprecated — sprite extraction failed, not used)
```

---

## Data Model (Firestore `mevites` collection)
```typescript
{
  id: string               // 8-char random ID (e.g. "88f7iiz2")
  who: string              // "Andrew Becker"
  when: string             // "Friday, July 17 at 8:00 PM"
  bringing: string         // "Two bottles of wine"
  why: string              // "We haven't talked in six months."
  arrivalStatus: ArrivalStatus  // "maybe"|"probably"|"definitely"|"on-my-way"|"open-the-door"
  senderPhone: string      // optional, not used in MVP
  receiverResponse: "obviously"|"adjust"|"terrible"|null
  status: "pending"|"adjusting"|"locked"|"declined"
  suggestedChange?: {
    newDate: string
    newTime: string
    note: string
    proposedAt: string
    proposedBy: "receiver"
  }
  confirmedAt?: string
  createdAt: string
  timeline: TimelineEvent[]
}
```

---

## Arrival Status States (5)
| Key | Label | Description |
|-----|-------|-------------|
| `maybe` | Maybe | It's a thought. |
| `probably` | Probably | Calendars are open. |
| `definitely` | Definitely | It's happening. |
| `on-my-way` | On My Way | No turning back. |
| `open-the-door` | Open The Door | I'm outside. |

---

## Design System
All styling uses **inline styles** (not Tailwind) for reliability across Vercel deployments. Tailwind classes caused rendering issues in production.

```
Brand orange:    #E8470A
Black:           #111111
Dark:            #1a1a1a
Gray text:       #888888
Light border:    #E8E8E8
Light bg:        #F5F5F5
```

### Hero Lockup (create page)
- Uses `public/m-lockup.png` as `<img>` tag (real asset, not SVG recreation)
- Layout: `[m-lockup.png] | vertical divider | Invite Yourself Over.`
- The PNG already contains M mark + MEVITE wordmark stacked correctly

### Door Slider ("This Is Happening")
- Single SVG door that opens via perspective foreshortening as slider moves
- Geometry: frame at `FX=30, FY=10, FW=100, FH=158, FS=8` in 180×200 viewBox
- Panel is a parallelogram with skew = `sin(angle) * 4`
- Recesses are perspective-mapped polygons (not rectangles)
- No rays on "Open The Door" state (removed — didn't work)
- 5 snap states: angles `[2, 20, 42, 65, 85]` degrees

### Form Fields
All use shared style from `RotatingPrompt.tsx`:
- Label: 10px, 700, #888, uppercase, 0.12em tracking
- Placeholder: 18px, 400, #CCC (animated rotation every 2.2s)
- Value: 18px, 600, #111
- Border: 1px solid #E0E0E0 bottom only

---

## Key Design Decisions
1. **No registration** — Mevites are public links, no auth required to view or respond
2. **Inline styles everywhere** — Tailwind was unreliable in Vercel production builds
3. **One link, always alive** — `/m/[id]` always shows latest status (real-time Firestore)
4. **Mobile-first** — All sheets are bottom drawers, all touch targets are large
5. **No notifications in MVP** — sender checks manually
6. **Logo as PNG** — M lockup uses actual PNG asset, not SVG recreation (too complex)

---

## Current State (as of June 22, 2026)
- ✅ Full create → share → mission page flow working
- ✅ Receiver response buttons (Obviously / Adjust / Terrible timing)
- ✅ Negotiate flow (suggest new time → sender confirms)
- ✅ Live timeline on mission page
- ✅ Add to Google Calendar when locked
- ✅ Door slider with 5 states and correct copy
- ✅ GitHub → Vercel auto-deploy pipeline
- ⚠️ Firestore rules are open (needs tightening before real users)
- ⚠️ No push notifications yet
- ⚠️ Email/Password auth enabled but not wired to UI
- ⚠️ No custom domain yet

---

## How to Deploy
Claude pushes to GitHub — Vercel auto-deploys in ~30s:
```bash
cd /home/claude/mevite
git add -A
git commit -m "description"
git push origin main
```

## How to Run Locally (Andrew's machine)
```bash
cd ~/Downloads/mevite
npm install
npm run dev
```
