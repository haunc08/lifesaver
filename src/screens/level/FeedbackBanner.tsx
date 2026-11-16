import type { Feedback } from '@/game/levelMachine'

const TONE: Record<Feedback['tone'], string> = {
  good: 'border-mint-edge bg-mint/25 text-mint-ink',
  warn: 'border-butter-edge bg-butter/30 text-ink',
  bad: 'border-coral-edge bg-coral/20 text-coral-ink',
}

/** What the game says about the player's last answer. */
export function FeedbackBanner({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) return null
  return (
    <p
      // The key replays the motion each time the message changes.
      key={feedback.text}
      role="status"
      className={`rounded-2xl border-2 px-4 py-3 leading-snug ${feedback.tone === 'good' ? 'animate-pop' : 'animate-shake'} ${TONE[feedback.tone]}`}
    >
      {feedback.text}
    </p>
  )
}
