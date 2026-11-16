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
