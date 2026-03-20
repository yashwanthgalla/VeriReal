import { Activity, AlertOctagon, CloudRain, Users } from 'lucide-react'
import type { NearbyRainPlace } from '../types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { RainMap } from '../components/RainMap.tsx'

interface AdminMonitoringPageProps {
  center: { lat: number; lon: number }
  places: NearbyRainPlace[]
  stats: {
    totalActiveUsers: number
    claimsTriggered: number
    flaggedCases: number
  }
}

export function AdminMonitoringPage({ center, places, stats }: AdminMonitoringPageProps) {
  const raining = places.filter((place) => place.isRaining)

  return (
    <div className="space-y-4">
      <Card title="Live Monitoring Panel" subtitle="Admin overview of worker movement and suspicious patterns.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-xs uppercase tracking-wide text-emerald-700">Total Active Users</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl text-slate-900">
              <Users className="h-5 w-5 text-emerald-700" />
              {stats.totalActiveUsers}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <p className="text-xs uppercase tracking-wide text-amber-700">Claims Triggered</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl text-slate-900">
              <Activity className="h-5 w-5 text-amber-700" />
              {stats.claimsTriggered}
            </p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-100">
            <p className="text-xs uppercase tracking-wide text-rose-700">Flagged Cases</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl text-slate-900">
              <AlertOctagon className="h-5 w-5 text-rose-700" />
              {stats.flaggedCases}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-700 p-4">
          <div className="mb-2 flex items-center justify-between text-slate-100">
            <p className="font-display text-sm">Live Rain Map</p>
            <Badge tone="warning">OpenStreetMap + Open-Meteo</Badge>
          </div>

          <RainMap center={center} places={places} />
        </div>
      </Card>

      <Card title="Raining Nearby" subtitle="Areas currently detecting precipitation.">
        {raining.length === 0 ? (
          <EmptyState
            icon={CloudRain}
            title="No rainfall detected"
            description="Nearby zones currently look clear."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {raining.map((place) => (
              <li key={place.id} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="font-display text-base font-semibold text-slate-900">{place.name}</p>
                <p className="text-sm text-slate-600">Rainfall: {place.precipitationMm.toFixed(1)} mm</p>
                <div className="mt-2">
                  <Badge tone="risk">Raining</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
