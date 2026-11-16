import { PHASES, type PhaseId } from '@/game/types'
import { Icon } from '@/ui/Icon'

interface Props {
  phase: PhaseId
  remainingMs: number
  clockRunning: boolean
  onHint: () => void
  onPause: () => void
}

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

const hudButton =
  'flex size-11 items-center justify-center rounded-2xl bg-cotton text-blue-ink shadow-[0_3px_0_var(--color-mist-deep)] active:translate-y-[3px] active:shadow-none'

/** Always-visible level header: clock, phase progress, hint and pause. */
export function Hud({ phase, remainingMs, clockRunning, onHint, onPause }: Props) {
  const current = PHASES.indexOf(phase)
  const low = remainingMs <= 15_000
  return (
    <header className="flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <div
        className={`min-w-[4.5rem] rounded-2xl bg-cotton px-3 py-2 text-center font-display text-xl font-bold tabular-nums shadow-[0_3px_0_var(--color-mist-deep)] ${low ? 'text-coral-ink' : 'text-ink'} ${clockRunning ? '' : 'opacity-60'}`}
        role="timer"
        aria-label="Thời gian còn lại"
      >
        {formatClock(remainingMs)}
      </div>
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
