import { FileClock, FileSearch, ShieldAlert, UploadCloud } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ClaimItem } from '../types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

interface ClaimStatusPageProps {
  claims: ClaimItem[]
}

export function ClaimStatusPage({ claims }: ClaimStatusPageProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(claims[0]?.id ?? null)

  const selected = useMemo(
    () => claims.find((claim) => claim.id === selectedClaimId) ?? claims[0],
    [claims, selectedClaimId],
  )

  const flaggedClaim = claims.find((claim) => claim.status === 'flagged')

  if (claims.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No claims yet"
        description="Your submitted claims will appear here with status updates."
      />
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <Card title="Claim Status" subtitle="Track your previous claims and review outcomes.">
        <div className="space-y-3">
          {claims.map((claim) => {
            const tone = claim.status === 'approved' ? 'safe' : claim.status === 'pending' ? 'warning' : 'risk'
            return (
              <button
                key={claim.id}
                type="button"
                onClick={() => setSelectedClaimId(claim.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected?.id === claim.id
                    ? 'border-slate-400 bg-slate-100/80'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-base font-semibold text-slate-900">{claim.id}</p>
                  <Badge tone={tone}>
                    {claim.status[0].toUpperCase() + claim.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">Submitted: {claim.submittedAt}</p>
                <p className="text-sm text-slate-700">Amount: {claim.amount}</p>
                {claim.reason && <p className="mt-1 text-sm text-rose-700">Reason: {claim.reason}</p>}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card title="Selected Claim" subtitle="Details for the current claim.">
          {selected ? (
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Claim ID:</span> {selected.id}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Submitted:</span> {selected.submittedAt}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Amount:</span> {selected.amount}
              </p>
            </div>
          ) : (
            <EmptyState
              icon={FileClock}
              title="Select a claim"
              description="Choose a claim from the list to see details."
            />
          )}
        </Card>

        {flaggedClaim && (
          <Card title="Flagged Claim Flow" subtitle="Additional verification is required.">
            <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
              <div className="flex items-center gap-2 font-medium">
                <ShieldAlert className="h-4 w-4" />
                Your claim is under review
              </div>
              <p className="mt-1">Reason: {flaggedClaim.reason ?? 'Potential anomaly detected.'}</p>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <UploadCloud className="h-4 w-4" />
              Submit Proof
            </button>

            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Upload option placeholder (image / video)
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
