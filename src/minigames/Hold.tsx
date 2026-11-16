import { useEffect, useRef, useState } from 'react'
import type { HoldConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Note, type NoteData } from './Note'
import { FREE_MISSES, type MinigameProps } from './types'
import { useDone } from './useDone'

const TICK_MS = 50
/** Share of progress lost when the player lets go early. */
const RELEASE_LOSS = 0.25
const RELEASE_COST = 0.2
const MIN_ACCURACY = 0.4

/** Press and hold until the bar fills. Letting go early loses progress and accuracy. */
export function Hold({ config, artId, scene, paused, onDone }: MinigameProps<HoldConfig>) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [note, setNote] = useState<NoteData | null>(null)
  const releases = useRef(0)
  const finished = progress >= 1
  const done = useDone(onDone)

  // The hold only counts while the game is running.
  const active = holding && !paused && !finished
  useEffect(() => {
    if (!active) return
    const step = TICK_MS / (config.holdSec * 1000)
    const timer = setInterval(() => setProgress((p) => Math.min(1, p + step)), TICK_MS)
    return () => clearInterval(timer)
  }, [active, config.holdSec])

  useEffect(() => {
    if (!finished) return
    const slips = Math.max(0, releases.current - FREE_MISSES)
    done({ completed: true, accuracy: Math.max(MIN_ACCURACY, 1 - RELEASE_COST * slips) })
    // Runs once: `finished` never goes back to false.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const press = () => {
    if (finished) return
    setHolding(true)
    setNote(null)
  }
  const release = () => {
    if (!holding || finished) return
    setHolding(false)
    releases.current += 1
    setProgress((p) => Math.max(0, p - RELEASE_LOSS))
    setNote({ tone: 'warn', text: config.releaseText })
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene} />
      <div
        className="h-5 overflow-hidden rounded-full border-4 border-cotton bg-cotton"
        role="progressbar"
        aria-label={config.action}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="h-full rounded-full bg-mint-edge" style={{ width: `${progress * 100}%` }} />
      </div>
      <button
        type="button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          press()
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press()
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') release()
        }}
        onContextMenu={(e) => e.preventDefault()}
        className={`w-full touch-none rounded-3xl px-6 py-5 font-display text-xl font-bold text-ink select-none [-webkit-touch-callout:none] ${holding && !finished ? 'translate-y-1 bg-mint shadow-[0_1px_0_var(--color-mint-edge)]' : 'bg-butter shadow-[0_5px_0_var(--color-butter-edge)]'}`}
      >
        {finished ? '✓ Xong rồi!' : holding ? config.holdingText : `Nhấn giữ: ${config.action}`}
      </button>
      <Note note={note} idle={config.realityNote} />
    </div>
  )
}
