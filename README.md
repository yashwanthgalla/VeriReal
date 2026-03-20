# VeriReal

Parametric Insurance Platform frontend for delivery workers.

This version uses:
- React + Vite + Tailwind CSS
- Firebase Authentication (email/password)
- Live geolocation from browser
- Live weather and rainfall data from Open-Meteo API
- OpenStreetMap tiles via Leaflet for rain map visualization

## 1) Install

```bash
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env` and fill Firebase values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3) Firebase setup

In Firebase console:
- Create a project
- Enable `Authentication > Sign-in method > Email/Password`
- Add your app and copy config into `.env`

You said you will add Firebase rules later, which is fine. This UI currently only requires Auth to run.

## 4) Run

```bash
npm run dev
```

## Live data behavior

- App asks for browser location permission.
- Every 60 seconds it refreshes:
  - current weather at user location
  - nearby rainfall around the location
- Admin panel map shows real rain/no-rain markers for nearby zones.
- Claims are now generated from real session conditions (trust score and weather state), not static mock claims.

## Build check

```bash
npm run build
```
