import { PHASES, type PhaseId } from '@/game/types'
import { Icon } from '@/ui/Icon'

interface Props {
  phase: PhaseId
  /** Time left, or null in phases where the clock does not run: it is then not shown at all. */
  remainingMs: number | null
  onHint: () => void
  onPause: () => void
}

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

/** Below this the clock turns coral. */
const LOW_MS = 15_000

const hudButton =
  'flex size-11 items-center justify-center rounded-2xl bg-cotton text-blue-ink shadow-[0_3px_0_var(--color-mist-deep)] active:translate-y-[3px] active:shadow-none'

/** Always-visible level header: the clock while it runs, phase progress, hint and pause. */
export function Hud({ phase, remainingMs, onHint, onPause }: Props) {
  const current = PHASES.indexOf(phase)
  return (
    <header className="flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      {remainingMs !== null && (
        <div
          className={`flex min-w-[5.25rem] animate-pop items-center justify-center gap-1.5 rounded-2xl bg-cotton px-2.5 py-2 font-display text-xl font-bold tabular-nums shadow-[0_3px_0_var(--color-mist-deep)] ${remainingMs <= LOW_MS ? 'text-coral-ink' : 'text-ink'}`}
          role="timer"
          aria-label="Thời gian còn lại"
        >
          <Icon name="soon" className="size-5" />
          {formatClock(remainingMs)}
        </div>
      )}
      <div
        className="flex flex-1 justify-center gap-1.5"
        role="progressbar"
        aria-label="Tiến trình màn chơi"
        aria-valuemin={1}
        aria-valuemax={PHASES.length}
        aria-valuenow={current + 1}
      >
        {PHASES.map((p, i) => (
          <span
            key={p}
            className={`h-2.5 flex-1 rounded-full ${i < current ? 'bg-mint-edge' : i === current ? 'bg-blue-edge' : 'bg-cotton'}`}
          />
        ))}
      </div>
      <button type="button" aria-label="Gợi ý" onClick={onHint} className={hudButton}>
        <Icon name="bulb" />
      </button>
      <button type="button" aria-label="Tạm dừng" onClick={onPause} className={hudButton}>
        <Icon name="pause" />
      </button>
    </header>
  )
}
