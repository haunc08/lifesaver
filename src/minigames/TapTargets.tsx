import { useState } from 'react'
import { sfx } from '@/audio'
import type { TapTargetsConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { Note, type NoteData } from './Note'
import { accuracyOf, type MinigameProps } from './types'
import { useDone } from './useDone'

/**
 * Do every task: tap its numbered pin in the scene or its row in the list. Some
 * of the numbered things must not be done; tapping one is explained and costs
 * accuracy.
 */
export function TapTargets({ config, artId, scene, onDone }: MinigameProps<TapTargetsConfig>) {
  const [hit, setHit] = useState<string[]>([])
  const [refused, setRefused] = useState<string[]>([])
  const [note, setNote] = useState<NoteData | null>(null)
  const done = useDone(onDone)

  // Tasks and decoys share one numbered list, mixed so the decoys do not stand out by position.
  const spots = [
    ...config.targets.map((t) => ({ ...t, note: null as string | null })),
    ...config.decoys,
  ].sort((a, b) => a.y - b.y || a.x - b.x)
  const remaining = config.targets.length - hit.length

  const tap = (id: string) => {
    if (hit.includes(id) || refused.includes(id) || remaining === 0) return
    const spot = spots.find((s) => s.id === id)
    if (!spot) return
    if (spot.note !== null) {
      setRefused([...refused, id])
      setNote({ tone: 'bad', text: spot.note })
      sfx('warn')
      return
    }
    const nextHit = [...hit, id]
    setHit(nextHit)
    setNote({ tone: 'good', text: `${spot.label}: đúng rồi!` })
    sfx('hit')
    if (nextHit.length === config.targets.length) {
      done({ completed: true, accuracy: accuracyOf(nextHit.length, refused.length) })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene}>
        {spots.map((s, i) => (
          // The list below carries the names; the pins are a second way to tap.
          <Pin
            key={s.id}
            x={s.x}
            y={s.y}
            tone={hit.includes(s.id) ? 'done' : refused.includes(s.id) ? 'off' : 'todo'}
            aria-hidden
            tabIndex={-1}
            onClick={() => tap(s.id)}
          >
            {hit.includes(s.id) ? '✓' : refused.includes(s.id) ? '✕' : i + 1}
          </Pin>
        ))}
      </SceneBox>
      <div className="grid grid-cols-2 gap-2">
        {spots.map((s, i) => {
          const isDone = hit.includes(s.id)
          const off = refused.includes(s.id)
          return (
            <button
              key={s.id}
              type="button"
              aria-disabled={isDone || off}
              onClick={() => tap(s.id)}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border-2 px-2.5 py-1.5 text-left text-sm leading-tight font-bold ${isDone ? 'border-mint-edge bg-mint/40 text-ink' : off ? 'border-mist-deep bg-cotton/50 text-ink-soft line-through' : 'border-mist-edge bg-cotton text-ink shadow-[0_3px_0_var(--color-mist-edge)]'}`}
            >
              <span
                aria-hidden
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display no-underline ${isDone ? 'bg-mint' : off ? 'bg-mist' : 'bg-butter'}`}
              >
                {isDone ? '✓' : off ? '✕' : i + 1}
              </span>
              {s.label}
            </button>
          )
        })}
      </div>
      <Note note={note} idle={`Còn ${remaining} việc cần làm. Việc không nên làm thì đừng chạm.`} />
    </div>
  )
}
