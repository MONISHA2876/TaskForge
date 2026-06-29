# TaskForge

TaskForge is an AI-powered productivity app built with Next.js, Firebase Authentication, and Gemini AI integrations. It helps users create personalized plans, track progress, and stay productive with immersive UI experiences.

## Features

- Email/password authentication
- Google and GitHub OAuth sign-in
- Firebase authentication and Firestore support
- AI-powered planning flows
- Modern responsive UI with Tailwind CSS and Framer Motion
- Dynamic authenticated dashboard for signed-in users
- Landing page experience for guest users

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Framer Motion
- Gemini AI (`@google/generative-ai`)
- Lucide React

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

3. Enable Firebase Authentication providers:

- Email/password
- Google
- GitHub

4. Add authorized domains in Firebase Console:

- Your app domain
- `localhost`

5. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — build production app
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Project Structure

- `app/` — Next.js app routes and pages
- `components/` — React UI components
- `lib/` — Firebase initialization and auth context
- `public/` — static assets
- `types/` — TypeScript types

## Notes

- `app/page.tsx` renders the authenticated dashboard (`HomePage`) when a user is signed in, otherwise it shows the guest landing page (`HomepageNew`).
- Firebase config is loaded from public environment variables in `lib/firebase.ts`.
- OAuth sign-in is implemented in `lib/auth-context.tsx` using Firebase `signInWithPopup` for Google and GitHub.
