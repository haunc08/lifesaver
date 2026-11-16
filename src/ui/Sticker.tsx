/**
 * Sticker-style icon: a glyph on a rounded badge. Emoji are placeholders
 * until the real icon set lands (docs/art-and-audio.md).
 */
export function Sticker({ glyph, className = '' }: { glyph: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mist text-2xl ${className}`}
    >
      {glyph}
    </span>
  )
}
