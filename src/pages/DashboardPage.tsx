import { CloudDrizzle, LocateFixed, Shield, Zap } from 'lucide-react'
import type { WorkerProfile } from '../types'
import { FraudDetectionIndicator } from '../components/FraudDetectionIndicator'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

interface DashboardPageProps {
  profile: WorkerProfile
  onRequestClaim: () => void
}

export function DashboardPage({ profile, onRequestClaim }: DashboardPageProps) {
  const weatherTone =
    profile.weatherLevel === 'normal' ? 'safe' : profile.weatherLevel === 'alert' ? 'warning' : 'risk'

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-4">
        <Card title="Worker Dashboard" subtitle="Your safety and insurance readiness in real time.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-100/70 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Status</p>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <Badge tone={profile.status === 'active' ? 'safe' : 'warning'}>
                  {profile.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl bg-slate-100/70 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Current Location</p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <LocateFixed className="h-4 w-4 text-sky-600" />
                <span>{profile.currentLocation}</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-100/70 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Weather</p>
              <div className="flex items-center gap-2">
                <CloudDrizzle className="h-4 w-4 text-sky-600" />
                <Badge tone={weatherTone}>
                  {profile.weatherLevel === 'red-alert'
                    ? 'Red Alert'
                    : profile.weatherLevel === 'alert'
                      ? 'Alert'
                      : 'Normal'}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-600">{profile.currentLocation}</p>
            </div>

            <div className="rounded-xl bg-slate-100/70 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Eligibility</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <Badge tone={profile.insuranceEligible ? 'safe' : 'risk'}>
                  {profile.insuranceEligible ? 'Eligible' : 'Not eligible'}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-600">Based on live trust score and current weather risk.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestClaim}
            className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Request Claim
          </button>
        </Card>
      </section>

      <FraudDetectionIndicator
        trustScore={profile.trustScore}
        gpsStability={profile.signals.gpsStability}
        movementActivity={profile.signals.movementActivity}
        networkConsistency={profile.signals.networkConsistency}
      />
    </div>
  )
}
