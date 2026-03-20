import type { PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  className?: string
}

export function Card({ title, subtitle, className = '', children }: CardProps) {
  return (
    <article
      className={`rounded-2xl border border-white/40 bg-white/75 p-5 shadow-[0_8px_24px_-12px_rgba(18,26,39,0.45)] backdrop-blur ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </header>
      )}
      {children}
    </article>
  )
}
