interface Props {
  count: number
  className?: string
  /** Pop the earned stars in one after another, starting after this many milliseconds. */
  revealAfterMs?: number
}

/** Gap between one star appearing and the next. */
export const STAR_STAGGER_MS = 350

export function Stars({ count, className = '', revealAfterMs }: Props) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${count} trên 3 sao`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden
          className={`${n <= count ? 'text-butter-edge' : 'text-mist-deep'} ${revealAfterMs !== undefined && n <= count ? 'animate-pop' : ''}`}
          style={
            revealAfterMs !== undefined && n <= count
              ? { animationDelay: `${revealAfterMs + (n - 1) * STAR_STAGGER_MS}ms` }
              : undefined
          }
        >
          {n <= count ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}
