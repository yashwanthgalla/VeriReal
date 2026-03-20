import type { PropsWithChildren } from 'react'

type Tone = 'safe' | 'warning' | 'risk' | 'neutral'

const toneClass: Record<Tone, string> = {
  safe: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  risk: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
}

interface BadgeProps extends PropsWithChildren {
  tone?: Tone
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  )
}
