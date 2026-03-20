interface SignalMeterProps {
  label: string
  value: number
}

export function SignalMeter({ label, value }: SignalMeterProps) {
  const tone = value >= 65 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
