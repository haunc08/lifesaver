import type { HTMLAttributes } from 'react'

/** White rounded panel with a hard-edged offset underneath. */
export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border-2 border-cotton bg-cotton p-4 shadow-[0_5px_0_var(--color-mist-deep)] ${className}`}
      {...rest}
    />
  )
}
