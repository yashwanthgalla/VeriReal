# VeriReal

A real-time frontend prototype for a **Parametric Insurance Platform for Delivery Workers**.

The app combines live location, weather conditions, trust signals, claim flow simulation, and admin monitoring in a modern React UI.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Firebase Authentication (Email/Password)
- Open-Meteo API (weather + precipitation)
- Nominatim Reverse Geocoding (location label)
- Leaflet + OpenStreetMap (live rain map)
- Lucide React (icons)

## Main Features

- Worker Dashboard
- User status, location, weather risk, eligibility
- Trust Score with fraud signal meters
- Claim trigger button

- Claim Status View
- Dynamic claim list (pending/flagged)
- Empty-state simulation toggle
- Flagged claim review flow with proof upload placeholder

- Admin Monitoring View
- Live map centered on worker location
- Rain markers in nearby zones (N/S/E/W/Center)
- Stats: active users, claims triggered, flagged cases

- Authentication
- Firebase email/password sign up and sign in
- Live auth state tracking

- Reliability UX
- Firebase configuration guard screen
- Runtime error boundary to prevent white-screen crashes
- Loading skeleton states

## Project Structure

- `src/App.tsx`: Main app shell, tab navigation, real-time orchestration
- `src/main.tsx`: Root bootstrap, providers, error boundary
- `src/lib/firebase.ts`: Firebase initialization + config validation
- `src/auth/AuthContext.tsx`: Auth context and auth actions
- `src/components/AuthPanel.tsx`: Login/signup UI
- `src/components/AppErrorBoundary.tsx`: Runtime crash protection UI
- `src/components/RainMap.tsx`: Leaflet map and rain markers
- `src/api/weather.ts`: Weather + geocoding API integration
- `src/pages/`: Dashboard, claims, admin pages
- `src/components/ui/`: Reusable UI primitives (card, badge, empty state, signal meter)

## Setup

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Create a `.env` file in project root (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Notes:
- `VITE_FIREBASE_MEASUREMENT_ID` is optional.
- After changing `.env`, restart the dev server.

## 3) Firebase Console setup

- Create project in Firebase
- Add web app and copy config values to `.env`
- Enable: `Authentication > Sign-in method > Email/Password`

## 4) Run locally

```bash
npm run dev
```

Open: `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Type-check and create production build
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## Real-Time Data Flow

- Browser requests geolocation permission
- Location is reverse-geocoded to readable area name
- Current weather is fetched for worker coordinates
- Nearby rainfall is fetched for 5 offsets around the worker
- Data refreshes every 60 seconds
- Trust score is recomputed from:
- GPS stability
- Movement activity
- Network consistency

## Weather Risk Rules (current UI logic)

- `normal`: low/zero precipitation
- `alert`: precipitation >= 1 mm or selected rain weather codes
- `red-alert`: precipitation >= 7 mm or thunderstorm weather codes

## Troubleshooting

### White page or app not loading

1. Verify `.env` exists and contains real Firebase values.
2. Ensure no placeholder values like `your_api_key` remain.
3. Restart dev server after env changes.
4. Check browser console for runtime errors.

The app includes:
- Firebase config guard (shows setup message instead of crashing)
- Error boundary fallback screen for unexpected runtime exceptions

### Location/Weather not updating

- Allow location permission in browser
- Disable strict tracking blockers that block API calls
- Confirm internet is available

### Firebase auth errors

- Confirm Email/Password provider is enabled in Firebase
- Confirm `authDomain` and `apiKey` match your project

## Security Notes

- Do not commit real `.env` secrets to public repositories.
- If any key was exposed, rotate credentials in Firebase Console.
- Keep production access controlled by Firebase rules (when you add Firestore/Storage).

## Current Limitations

- Claims are in-memory for current session only (not persisted to Firestore yet)
- Upload in flagged flow is a UI placeholder only
- Admin stats are single-session simulation, not multi-user backend analytics

## Next Suggested Upgrades

- Persist claims to Firestore with per-user history
- Add Firebase Storage for proof uploads
- Add role-based admin authorization
- Add analytics events and dashboard trends
- Add offline caching and retry queue for API calls
