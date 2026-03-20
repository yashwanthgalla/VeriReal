import { BarChart3, ClipboardList, LayoutDashboard, LoaderCircle, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AdminMonitoringPage } from './pages/AdminMonitoringPage'
import { ClaimStatusPage } from './pages/ClaimStatusPage'
import { DashboardPage } from './pages/DashboardPage'
import { AuthPanel } from './components/AuthPanel'
import { useAuth } from './auth/AuthContext'
import { firebaseConfigError } from './lib/firebase'
import { getCurrentWeather, getNearbyRainPlaces, reverseGeocode } from './api/weather'
import type { ClaimItem, NearbyRainPlace, WeatherSnapshot, WorkerProfile } from './types'

type ViewKey = 'dashboard' | 'claims' | 'admin'

const views: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'claims', label: 'Claim Status', icon: ClipboardList },
  { key: 'admin', label: 'Admin Monitoring', icon: BarChart3 },
]

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [loading, setLoading] = useState(true)
  const [simulateEmptyClaims, setSimulateEmptyClaims] = useState(false)
  const [claims, setClaims] = useState<ClaimItem[]>([])
  const [locationLabel, setLocationLabel] = useState('Locating...')
  const [center, setCenter] = useState({ lat: -6.2, lon: 106.8 })
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyRainPlace[]>([])
  const [liveError, setLiveError] = useState<string | null>(null)
  const [networkConsistency, setNetworkConsistency] = useState(70)
  const [movementActivity, setMovementActivity] = useState(50)
  const [gpsStability, setGpsStability] = useState(60)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timeout)
  }, [activeView])

  useEffect(() => {
    const updateNetwork = () => {
      const network = navigator as Navigator & {
        connection?: { effectiveType?: string; downlink?: number }
      }

      if (!navigator.onLine) {
        setNetworkConsistency(15)
        return
      }

      const downlinkScore = Math.min((network.connection?.downlink ?? 3) * 15, 70)
      const typeBoost =
        network.connection?.effectiveType === '4g'
          ? 30
          : network.connection?.effectiveType === '3g'
            ? 20
            : 10

      setNetworkConsistency(Math.round(Math.min(100, downlinkScore + typeBoost)))
    }

    updateNetwork()
    window.addEventListener('online', updateNetwork)
    window.addEventListener('offline', updateNetwork)

    return () => {
      window.removeEventListener('online', updateNetwork)
      window.removeEventListener('offline', updateNetwork)
    }
  }, [])

  if (firebaseConfigError) {
    return (
      <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto mt-16 w-full max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="font-display text-2xl font-semibold text-amber-900">Firebase Configuration Needed</h1>
          <p className="mt-2 text-sm text-amber-800">{firebaseConfigError}</p>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-amber-900">
            <li>Create a `.env` file from `.env.example`.</li>
            <li>Paste your real Firebase config values.</li>
            <li>Restart the Vite dev server.</li>
          </ol>
        </section>
      </main>
    )
  }

  useEffect(() => {
    if (!user) {
      return
    }

    let cancelled = false

    const loadLiveData = async () => {
      try {
        setLiveError(null)

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 15000,
          })
        })

        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const accuracy = position.coords.accuracy
        const speed = position.coords.speed ?? 0

        if (!cancelled) {
          setCenter({ lat, lon })
          setGpsStability(Math.max(10, Math.min(100, Math.round(100 - accuracy / 1.7))))
          setMovementActivity(Math.max(20, Math.min(100, Math.round(speed * 25 + 30))))
        }

        const [resolvedLocation, currentWeather, places] = await Promise.all([
          reverseGeocode(lat, lon),
          getCurrentWeather(lat, lon),
          getNearbyRainPlaces(lat, lon),
        ])

        if (!cancelled) {
          setLocationLabel(resolvedLocation)
          setWeather(currentWeather)
          setNearbyPlaces(places)
        }
      } catch (error) {
        if (!cancelled) {
          setLiveError(error instanceof Error ? error.message : 'Unable to fetch live data')
        }
      }
    }

    loadLiveData()
    const interval = setInterval(loadLiveData, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user])

  if (authLoading) {
    return (
      <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-white/45 bg-white/60 p-5">
              <div className="mb-3 h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </section>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <AuthPanel />
      </main>
    )
  }

  const trustScore = Math.max(
    0,
    Math.min(100, Math.round(gpsStability * 0.45 + movementActivity * 0.2 + networkConsistency * 0.35)),
  )

  const profile: WorkerProfile = {
    id: user.uid,
    name: user.email ?? 'Delivery Worker',
    status: 'active',
    currentLocation: locationLabel,
    insuranceEligible: trustScore >= 40,
    trustScore,
    weatherLevel: weather?.level ?? 'normal',
    signals: {
      gpsStability,
      movementActivity,
      networkConsistency,
    },
  }

  const activeClaims = simulateEmptyClaims ? [] : claims
  const adminStats = {
    totalActiveUsers: 1,
    claimsTriggered: claims.length,
    flaggedCases: claims.filter((claim) => claim.status === 'flagged').length,
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-3xl border border-white/45 bg-white/70 p-5 shadow-[0_12px_36px_-20px_rgba(15,23,42,0.55)] backdrop-blur">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">VeriReal Platform</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
          Parametric Insurance Platform for Delivery Workers
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
          Live weather and rain-zone data, real Firebase authentication, and trust-based claim flow.
        </p>

        {liveError && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{liveError}</p>}
        {!liveError && weather && (
          <p className="mt-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
            Live weather: {weather.temperatureC.toFixed(1)} C, rain {weather.precipitationMm.toFixed(1)} mm, wind{' '}
            {weather.windSpeed.toFixed(1)} km/h
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {views.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setLoading(true)
                setActiveView(key)
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                activeView === key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}

          {activeView === 'claims' && (
            <button
              type="button"
              onClick={() => setSimulateEmptyClaims((v) => !v)}
              className="ml-auto rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {simulateEmptyClaims ? 'Load Demo Claims' : 'Show Empty State'}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              void logout()
            }}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-white/45 bg-white/60 p-5">
              <div className="mb-3 h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
              <LoaderCircle className="mt-4 h-5 w-5 animate-spin text-slate-400" />
            </div>
          ))}
        </section>
      ) : (
        <section className="animate-[fadeIn_300ms_ease-out]">
          {activeView === 'dashboard' && (
            <DashboardPage
              profile={profile}
              onRequestClaim={() => {
                const status = trustScore < 45 ? 'flagged' : 'pending'
                const reason = status === 'flagged' ? 'Location anomaly detected' : undefined
                const timestamp = new Date()
                const newClaim: ClaimItem = {
                  id: `CLM-${timestamp.getTime().toString().slice(-6)}`,
                  submittedAt: timestamp.toLocaleString(),
                  amount: weather?.level === 'red-alert' ? '$140' : '$95',
                  status,
                  reason,
                }
                setClaims((prev) => [newClaim, ...prev])
                setLoading(true)
                setActiveView('claims')
              }}
            />
          )}
          {activeView === 'claims' && <ClaimStatusPage claims={activeClaims} />}
          {activeView === 'admin' && <AdminMonitoringPage center={center} places={nearbyPlaces} stats={adminStats} />}
        </section>
      )}
    </main>
  )
}

export default App
