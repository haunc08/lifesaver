import type { ReactNode } from 'react'

/** Rounded badge holding an icon, a number or a small picture. */
export function Sticker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mist font-display text-xl font-bold text-blue-ink ${className}`}
    >
      {children}
    </span>
  )
}
