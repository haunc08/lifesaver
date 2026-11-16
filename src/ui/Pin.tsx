import type { ButtonHTMLAttributes } from 'react'

export type PinTone = 'todo' | 'done' | 'alert' | 'idle' | 'off'

const TONE: Record<PinTone, string> = {
  todo: 'animate-pulse bg-butter',
  done: 'bg-mint',
  alert: 'bg-coral',
  idle: 'bg-cotton',
  off: 'bg-mist text-ink-soft',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Position inside the scene, in percent. */
  x: number
  y: number
  tone: PinTone
  /** Dashed outline: a place to put something, not a thing to inspect. */
  dashed?: boolean
}

/**
 * Small round marker on a scene. It is drawn small so the picture stays visible,
 * but its touch area is larger than the circle.
 */
export function Pin({ x, y, tone, dashed = false, className = '', style, ...rest }: Props) {
  return (
    <button
      type="button"
      style={{ left: `${x}%`, top: `${y}%`, ...style }}
      className={`absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-base leading-none font-bold text-ink shadow-[0_3px_0_var(--color-ink-soft)] after:absolute after:-inset-1.5 after:rounded-full ${dashed ? 'border-2 border-dashed border-ink' : 'border-[3px] border-cotton'} ${TONE[tone]} ${className}`}
      {...rest}
    />
  )
}
