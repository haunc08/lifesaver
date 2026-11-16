import { useState, type PointerEvent } from 'react'
import type { TapTargetsConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import type { MinigameProps } from './types'

/** Stray taps forgiven before they start to cost accuracy. */
const FREE_MISSES = 1

/** Tap every target in the scene. Accuracy drops with taps that hit nothing. */
export function TapTargets({ config, scene, onDone }: MinigameProps<TapTargetsConfig>) {
  const [hit, setHit] = useState<string[]>([])
  const [misses, setMisses] = useState(0)
  const remaining = config.targets.filter((t) => !hit.includes(t.id))

  const tapTarget = (e: PointerEvent, id: string) => {
    e.stopPropagation()
    if (hit.includes(id)) return
    const nextHit = [...hit, id]
    setHit(nextHit)
    if (nextHit.length === config.targets.length) {
      const counted = Math.max(0, misses - FREE_MISSES)
      onDone({ completed: true, accuracy: nextHit.length / (nextHit.length + counted) })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox scene={scene} onPointerDown={() => setMisses((n) => n + 1)}>
        {config.targets.map((t) => {
          const done = hit.includes(t.id)
          return (
            <button
              key={t.id}
              type="button"
              aria-disabled={done}
              onPointerDown={(e) => tapTarget(e, t.id)}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-cotton px-3 py-2 text-sm font-bold shadow-[0_3px_0_var(--color-mist-deep)] ${done ? 'bg-mint text-ink' : 'animate-pulse bg-butter text-ink'}`}
            >
              {done ? '✓ ' : ''}
              {t.label}
            </button>
          )
        })}
      </SceneBox>
      <p className="text-center text-sm text-ink-soft">Còn {remaining.length} việc cần làm</p>
    </div>
  )
}
