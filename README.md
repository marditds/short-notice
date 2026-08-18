# ShortNotice

**Author:** [@marditds](https://github.com/marditds)

ShortNotice is an ephemeral social platform: short text (and GIF) posts that automatically expire and delete after a set time. It's built around impermanence by design — a focused, low-noise alternative to endlessly scrolling, permanent-feed social apps.

## Features

- **Self-expiring posts** — every "notice" is created with an expiration time; a scheduled backend job cleans it up (and all related data) automatically once it expires
- **Three account types** — Personal, Business (posts prefixed "Ad:"), and Organizational (private, group-oriented updates for teams or classes)
- **AI-assisted post composition** — Gemini-powered suggestions to help draft a notice
- **Social interactions** — likes, saves, and reactions on posts, plus user profiles and a feed
- **Google OAuth + standard auth** — sign in with Google or a standard account, including password reset and full account deletion
- **Image handling** — in-app image cropping before posting
- **Bot protection** — reCAPTCHA on key actions

## Tech Stack

- **Frontend:** React 18, React Router, React Bootstrap, react-easy-crop, gif-picker-react
- **Auth:** Appwrite Auth + Google OAuth (`@react-oauth/google`)
- **Backend:** Appwrite (database, storage), Netlify Functions (Node.js)
- **AI:** Google Gemini API
- **Infra:** Vite, Netlify, reCAPTCHA

## Serverless Functions

| Function | Purpose |
|---|---|
| `deleteExpired` | Scheduled job that cascades-deletes expired notices along with their related likes, saves, and reactions |
| `geminiAccess` | Calls the Gemini API to help generate notice text |
| `reCaptchaAccess` | Server-side reCAPTCHA verification |
| `userAuth` | Backend auth handling |
| `userDelete` | Handles full account deletion |

## How Expiration Works

Every notice is stored with an `expiresAt` timestamp. The `deleteExpired` function runs on a schedule, checks for notices past their expiration, and removes the notice along with every related record (likes, saves, reactions) across collections — keeping the feed genuinely temporary rather than just visually hidden.

## Getting Started

```bash
npm install
npm run dev
```

Requires an Appwrite project (database/collections configured) and Netlify Functions with environment variables for Appwrite, Gemini, Google OAuth, and reCAPTCHA credentials.
