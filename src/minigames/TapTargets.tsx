import { sfx } from '@/audio'
import { useState } from 'react'
import type { TapTargetsConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { accuracyOf, type MinigameProps } from './types'

/**
 * Do every task: tap its numbered pin in the scene or its row in the list.
 * Accuracy drops with taps on the scene that hit nothing.
 */
export function TapTargets({ config, artId, scene, onDone }: MinigameProps<TapTargetsConfig>) {
  const [hit, setHit] = useState<string[]>([])
  const [misses, setMisses] = useState(0)
  const remaining = config.targets.length - hit.length

  const tap = (id: string) => {
    if (hit.includes(id)) return
    const nextHit = [...hit, id]
    setHit(nextHit)
    sfx('hit')
    if (nextHit.length === config.targets.length) {
      onDone({ completed: true, accuracy: accuracyOf(nextHit.length, misses) })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene} onPointerDown={() => setMisses((n) => n + 1)}>
        {config.targets.map((t, i) => (
          // The list below carries the names; the pins are a second way to tap.
          <Pin
            key={t.id}
            x={t.x}
            y={t.y}
            tone={hit.includes(t.id) ? 'done' : 'todo'}
            aria-hidden
            tabIndex={-1}
            onPointerDown={(e) => {
              e.stopPropagation()
              tap(t.id)
            }}
          >
            {hit.includes(t.id) ? '✓' : i + 1}
          </Pin>
        ))}
      </SceneBox>
      <div className="grid grid-cols-2 gap-2">
        {config.targets.map((t, i) => {
          const done = hit.includes(t.id)
          return (
            <button
              key={t.id}
              type="button"
              aria-disabled={done}
              onClick={() => tap(t.id)}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border-2 px-2.5 py-1.5 text-left text-sm leading-tight font-bold ${done ? 'border-mint-edge bg-mint/40 text-ink' : 'border-cotton bg-cotton text-ink shadow-[0_3px_0_var(--color-mist-deep)]'}`}
            >
              <span
                aria-hidden
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display ${done ? 'bg-mint' : 'bg-butter'}`}
              >
                {done ? '✓' : i + 1}
              </span>
              {t.label}
            </button>
          )
        })}
      </div>
      <p className="text-center text-sm text-ink-soft">Còn {remaining} việc cần làm</p>
    </div>
  )
}
