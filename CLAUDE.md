# MEVITE — Project Context for Claude

## What is Mevite?
Mevite is an "anti-RSVP" consumer web app where people invite themselves over to friends' places. Core philosophy: **"Mevite is an action, not an account."** No user auth. The URL is the access token.

**Live:** https://mevite.me  
**Repo:** github.com/ajbckr/mevite  
**Stack:** Next.js 16, Firebase Firestore, Vercel (auto-deploy on push to `main`)  
**Vercel account:** bckr  
**Firebase project ID:** in NEXT_PUBLIC_FIREBASE_PROJECT_ID env var  

---

## Developer Workflow
- Claude clones to `/home/claude/mevite`, edits files, commits and pushes directly
- Push via HTTPS with GitHub token embedded in remote URL (user provides token)
- **Always run `npx tsc --noEmit` before pushing** — Vercel builds fail on TypeScript errors
- Auto-deploys on push to `main` (~30s to live)
- Inline React styles preferred over Tailwind
- Mobile-first design

---

## Design System
- **Brand orange:** `#E8470A`
- **Background (warm gray):** `#F7F7F5`
- **White cards:** `#FFFFFF` with `border: 2px solid #E8470A` for featured cards
- **Font:** Inter (loaded via @fontsource/inter)
- **OG background:** `#F5EFE6` cream
- Logo assets: `/public/mevite-wordmark.png`, `/public/m-lockup.png`
- Custom icons (orange SVG): `/public/icon-date.svg`, `/public/icon-bring.svg`, `/public/icon-message.svg`

---

## Data Model — Firestore `mevites/{id}`

```typescript
interface Mevite {
  id: string;
  who: string;           // recipient (who they're visiting)
  sender: string;        // person showing up (added mid-project)
  when: string;          // display string e.g. "Friday, June 26 at 9:00 PM"
  whenIso?: string;      // ISO datetime e.g. "2026-07-15T20:00" — USE THIS for calendar
  bringing: string;
  why: string;
  arrivalStatus: ArrivalStatus;
  senderPhone: string;
  receiverResponse?: "obviously" | "adjust" | "terrible";
  suggestedChange?: { newDate: string; newTime: string; note: string; };
  confirmedAt?: string;
  createdAt: string;
  timeline: TimelineEvent[];
}

type ArrivalStatus = "maybe" | "probably" | "definitely" | "locked-in" | "open-the-door"
```

**Important:** Old Mevites created before `sender` field existed will have `sender` undefined — fall back to `mevite.who` for display. Old Mevites without `whenIso` should not show calendar buttons.

---

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home/form page ("use client") |
| `app/share/[id]/page.tsx` | "It's ready. Send it." page after creation |
| `app/m/[id]/page.tsx` | Mission/receiver page — dual view |
| `app/m/[id]/layout.tsx` | Dynamic metadata + OG image URL per Mevite |
| `app/m/[id]/adjust/page.tsx` | Suggest time change page |
| `app/api/og/route.tsx` | Dynamic OG image — edge runtime |
| `app/api/mevite/[id]/route.ts` | Firestore data API route |
| `lib/types.ts` | All TypeScript types + prompt arrays |
| `lib/mevite.ts` | All Firestore operations |
| `lib/analytics.ts` | GA4 event tracking (G-6EFZYTQR30) |
| `components/DoorSlider.tsx` | Commitment slider with animated door |
| `components/RotatingPrompt.tsx` | Form field with rotating placeholder |
| `components/MeviteFooter.tsx` | Shared footer |

---

## Critical Architecture Decisions

### Navigation After Create
Uses `window.location.href = /share/${id}` (NOT `router.push`) — hard navigation prevents stale route caching bug where old Mevite URL appeared in new SMS.

### OG Image (`/api/og?id=`)
- Edge runtime, system fonts only (font fetching caused timeouts)
- Plate (`og-plate.jpg`) loaded via URL, NOT base64
- Firestore data with 4s abort timeout
- Layout at `app/m/[id]/layout.tsx` points meta to `/api/og?id=${id}`

### Calendar Events
- Always use `whenIso` (exact ISO) over `when` (display string) for date math
- Calendar buttons only shown when `whenDate !== null`

### Commitment Slider
- 5 states: maybe(2°) → probably(20°) → definitely(42°) → locked-in(65°) → open-the-door(85°)
- Smooth continuous RAF animation, snaps on release with ease-out-cubic
- Door geometry: `FX=30, FY=10, FW=110, FH=158, FS=8`

### Double Response Prevention
`respondToMevite()` in `lib/mevite.ts` reads current state first and returns early if `receiverResponse` is already terminal ("obviously" or "terrible").

---

## Environment Variables (Vercel)
All `NEXT_PUBLIC_FIREBASE_*` — API key, auth domain, project ID, storage bucket, messaging sender ID, app ID, measurement ID.

---

## Firestore Security Rules
```
allow get: if true;
allow create: if true;  
allow update: if resource != null;
allow list: if false;
allow delete: if false;
```

---

## Domain & Services
- **Domain:** mevite.me (GoDaddy)
- **Email:** ImprovMX forwarding → `me@mevite.me`
- **Analytics:** GA4 G-6EFZYTQR30
- **Sitemap:** submitted to Google Search Console ✅

---

## Open Items / Future Work
1. **Custom 404 page** — add `app/not-found.tsx`
2. **ODP (Open Door Policy)** — vanity URLs (`mevite.me/andrew`), PIN-protected owner view, sliders for availability/vibe. Planned V2 feature.
3. **Sender notifications** — no way for sender to know when receiver opens/responds
4. **Mevite history** — no past Mevites view (intentional for now, no auth)
5. **Dynamic OG font** — currently system fonts; Inter 900 loading caused edge timeouts
6. **Loading animation** — needs revisit, was reverting/extending cycle duration

---

## SEO Keywords
"anti-evite", "invite yourself over", "no RSVP app", "casual hangout app", "skip the RSVP"
