import { art } from '@/art'
import type { Mood } from '@/game/types'

export type GuideMood = Mood | 'cheer'

/** The guide is never the one who is hurt, so "pain" shows as worry. */
const IMAGE: Record<GuideMood, string> = {
  neutral: 'guide-neutral',
  happy: 'guide-happy',
  worried: 'guide-worried',
  pain: 'guide-worried',
  surprised: 'guide-surprised',
  relieved: 'guide-relieved',
  cheer: 'guide-cheer',
}

/** The guide character with one of its expressions. Decorative: the name is in the text. */
export function Guide({
  mood = 'neutral',
  className = '',
}: {
  mood?: GuideMood
  className?: string
}) {
  return (
    <img
      src={art(IMAGE[mood])}
      alt=""
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  )
}
