import { sfx } from '@/audio'
import { useState } from 'react'
import type { ScanConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { Note, type NoteData } from './Note'
import { accuracyOf, type MinigameProps } from './types'
import { useDone } from './useDone'

/**
 * Find every hazard among the numbered spots: tap a pin in the scene or its row
 * in the list. Marking a harmless spot costs accuracy.
 */
export function Scan({ config, artId, scene, onDone }: MinigameProps<ScanConfig>) {
  const [tapped, setTapped] = useState<string[]>([])
  const [note, setNote] = useState<NoteData | null>(null)
  const done = useDone(onDone)

  const hazards = config.spots.filter((s) => s.hazard)
  const found = hazards.filter((s) => tapped.includes(s.id)).length

  const tap = (id: string) => {
    const spot = config.spots.find((s) => s.id === id)
    if (!spot || tapped.includes(id)) return
    const next = [...tapped, id]
    setTapped(next)
    setNote({ tone: spot.hazard ? 'good' : 'warn', text: spot.note })
    sfx(spot.hazard ? 'hit' : 'wrong')
    const nowFound = hazards.filter((s) => next.includes(s.id)).length
    if (nowFound === hazards.length) {
      done({ completed: true, accuracy: accuracyOf(nowFound, next.length - nowFound) })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene}>
        {config.spots.map((s, i) => {
          const seen = tapped.includes(s.id)
          return (
            <Pin
              key={s.id}
              x={s.x}
              y={s.y}
              tone={!seen ? 'idle' : s.hazard ? 'alert' : 'off'}
              aria-hidden
              tabIndex={-1}
              onClick={() => tap(s.id)}
            >
              {seen ? (s.hazard ? '!' : '✓') : i + 1}
            </Pin>
          )
        })}
      </SceneBox>
      <Note note={note} idle="Chạm vào số trên hình hoặc tên bên dưới để đánh dấu mối nguy." />
      <div className="grid grid-cols-2 gap-2">
        {config.spots.map((s, i) => {
          const seen = tapped.includes(s.id)
          const look = !seen
            ? 'border-cotton bg-cotton text-ink shadow-[0_3px_0_var(--color-mist-deep)]'
            : s.hazard
              ? 'border-coral-edge bg-coral/40 text-ink'
              : 'border-mist-deep bg-mist text-ink-soft'
          return (
            <button
              key={s.id}
              type="button"
              aria-disabled={seen}
              onClick={() => tap(s.id)}
              className={`flex min-h-11 items-center gap-2 rounded-2xl border-2 px-2.5 py-1 text-left text-sm leading-tight font-bold ${look}`}
            >
              <span
                aria-hidden
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display ${!seen ? 'bg-mist' : s.hazard ? 'bg-coral' : 'bg-cotton'}`}
              >
                {seen ? (s.hazard ? '!' : '✓') : i + 1}
              </span>
              <span>
                {s.label}
                {seen && (
                  <span className="block text-xs font-normal">
                    {s.hazard ? 'Nguy hiểm' : 'Không nguy hiểm'}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-center text-sm text-ink-soft">
        Đã tìm thấy {found}/{hazards.length} mối nguy
      </p>
    </div>
  )
}
