import type { ReactNode } from 'react'
import { Card } from './Card'

interface Props {
  title: string
  children: ReactNode
}

/**
 * A panel over the current screen, on a blurred backdrop. Buttons inside are
 * stacked with enough room between them to read as separate choices.
 */
export function Dialog({ title, children }: Props) {
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={title}
      className="absolute inset-0 z-20 flex items-center justify-center bg-ink/30 p-6 backdrop-blur-sm"
    >
      <Card className="flex w-full animate-pop flex-col gap-4 !p-5">
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {children}
      </Card>
    </div>
  )
}
