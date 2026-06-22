# MEVITE

> Invite Yourself Over.

Stop saying "we should get together." Show up.

## Stack
- **Next.js 15** (App Router)
- **Firebase Firestore** (realtime live mission page)
- **Tailwind CSS**
- **Vercel** (deploy target)

## Setup

### 1. Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a **Web app**
4. Enable **Firestore Database** (start in test mode for MVP)
5. Copy your config values

### 2. Environment Variables
Copy `.env.local` and fill in your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Firebase Security Rules (Firestore)
In the Firebase console, set these rules for MVP:

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

### 4. Run locally
```bash
npm install
npm run dev
```

### 5. Deploy to Vercel
```bash
npx vercel --prod
```
Add your env vars in the Vercel dashboard under Project Settings → Environment Variables.

## Routes
- `/` — Create a Mevite
- `/share/[id]` — Share page after creation
- `/m/[id]` — Live mission page (receiver view + live updates)
- `/m/[id]/adjust` — Suggest a new time

## Data Model
Each Mevite in Firestore:
```json
{
  "id": "abc12345",
  "who": "Andrew Becker",
  "when": "Friday, July 17\n8:00 PM",
  "bringing": "Two bottles of wine",
  "why": "We haven't talked in six months.",
  "arrivalStatus": "packing",
  "receiverResponse": null,
  "status": "pending",
  "timeline": [...],
  "createdAt": "2026-06-22T..."
}
```
