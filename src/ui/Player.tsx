import { art } from '@/art'

/** The player's character. Decorative: the player's name is shown as text. */
export function Player({ className = '' }: { className?: string }) {
  return (
    <img
      src={art('player')}
      alt=""
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  )
}

/**
 * The player's face as a square badge. The picture is a full-body figure, so it
 * is enlarged and shifted until the box frames the head.
 */
export function PlayerAvatar({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-block size-14 shrink-0 overflow-hidden rounded-2xl bg-blue/40 ${className}`}
    >
      <img
        src={art('player')}
        alt=""
        draggable={false}
        className="absolute top-[-6%] left-[-14%] w-[128%] max-w-none select-none"
      />
    </span>
  )
}
