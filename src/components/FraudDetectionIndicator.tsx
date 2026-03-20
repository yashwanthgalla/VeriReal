import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { SignalMeter } from './ui/SignalMeter'

interface FraudDetectionIndicatorProps {
  trustScore: number
  gpsStability: number
  movementActivity: number
  networkConsistency: number
}

export function FraudDetectionIndicator({
  trustScore,
  gpsStability,
  movementActivity,
  networkConsistency,
}: FraudDetectionIndicatorProps) {
  const tone = trustScore >= 70 ? 'safe' : trustScore >= 45 ? 'warning' : 'risk'

  return (
    <Card title="Fraud Detection Indicator" subtitle="UI preview of trust and anomaly signals.">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-100/80 p-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Trust Score</p>
          <p className="font-display text-2xl font-semibold text-slate-900">{trustScore}/100</p>
        </div>
        <Badge tone={tone}>{tone === 'risk' ? 'Risk' : tone === 'warning' ? 'Warning' : 'Safe'}</Badge>
      </div>

      <div className="space-y-3">
        <SignalMeter label="GPS Stability" value={gpsStability} />
        <SignalMeter label="Movement Activity" value={movementActivity} />
        <SignalMeter label="Network Consistency" value={networkConsistency} />
      </div>

      {trustScore < 45 ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-100">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Suspicious Activity</span>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-medium">Behavior appears normal.</span>
        </div>
      )}
    </Card>
  )
}
