import { useRef, useState, type PointerEvent } from 'react'
import type { DragPlaceConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { Note, type NoteData } from './Note'
import { accuracyOf, type MinigameProps } from './types'
import { useDone } from './useDone'

const LETTERS = 'ABCDEF'

/** A press that moves further than this is a drag, not a tap. */
const DRAG_THRESHOLD_PX = 8

interface Drag {
  itemId: string
  startX: number
  startY: number
  x: number
  y: number
  moved: boolean
}

/**
 * Put each item where it belongs. Works two ways: drag an item onto a zone, or
 * tap an item and then tap a zone. Decoy items must be left in the tray.
 */
export function DragPlace({ config, artId, scene, onDone }: MinigameProps<DragPlaceConfig>) {
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [refused, setRefused] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [note, setNote] = useState<NoteData | null>(null)
  const misses = useRef(0)
  const done = useDone(onDone)

  const needed = config.items.filter((i) => i.zoneId !== null)
  const itemOf = (id: string) => config.items.find((i) => i.id === id)

  const attempt = (itemId: string, zoneId: string) => {
    const item = itemOf(itemId)
    if (!item || placed[itemId]) return
    setSelected(null)
    if (item.zoneId !== zoneId) {
      misses.current += 1
      setNote({ tone: item.zoneId === null ? 'bad' : 'warn', text: item.wrongNote })
      if (item.zoneId === null) setRefused((r) => [...r, itemId])
      return
    }
    const next = { ...placed, [itemId]: zoneId }
    setPlaced(next)
    setNote({ tone: 'good', text: `${item.label}: đúng chỗ rồi!` })
    if (needed.every((i) => next[i.id])) {
      done({ completed: true, accuracy: accuracyOf(needed.length, misses.current) })
    }
  }

  const onItemDown = (e: PointerEvent<HTMLButtonElement>, itemId: string) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      itemId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    })
  }
  const onItemMove = (e: PointerEvent) => {
    if (!drag) return
    const far = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD_PX
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved: drag.moved || far })
  }
  const onItemUp = (e: PointerEvent) => {
    if (!drag) return
    setDrag(null)
    if (!drag.moved) {
      // A tap: pick the item up, or put it back down.
      setSelected((s) => (s === drag.itemId ? null : drag.itemId))
      return
    }
    const under = document.elementFromPoint(e.clientX, e.clientY)
    const zoneId = under?.closest<HTMLElement>('[data-zone]')?.dataset.zone
    if (zoneId) attempt(drag.itemId, zoneId)
  }

  const dragged = drag?.moved ? itemOf(drag.itemId) : undefined

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene}>
        {config.zones.map((z, i) => {
          const filled = config.items.some((item) => placed[item.id] === z.id)
          return (
            <Pin
              key={z.id}
              x={z.x}
              y={z.y}
              dashed
              tone={filled ? 'done' : selected || dragged ? 'todo' : 'idle'}
              data-zone={z.id}
              aria-label={`Vị trí: ${z.label}`}
              onClick={() => selected && attempt(selected, z.id)}
              className="!size-11"
            >
              {LETTERS[i]}
            </Pin>
          )
        })}
      </SceneBox>
      <ul className="space-y-1">
        {config.zones.map((z, i) => {
          const here = config.items.filter((item) => placed[item.id] === z.id)
          return (
            <li key={z.id} className="flex items-baseline gap-2 text-sm leading-tight">
              <span className="flex size-6 shrink-0 items-center justify-center self-center rounded-full bg-cotton font-display font-bold">
                {LETTERS[i]}
              </span>
              <span className="font-bold">{z.label}</span>
              {here.length > 0 && (
                <span className="text-mint-ink">✓ {here.map((item) => item.label).join(', ')}</span>
              )}
            </li>
          )
        })}
      </ul>
      <Note note={note} idle="Kéo từng món vào ô chữ cái trên hình, hoặc chạm món rồi chạm ô." />
      <div className="flex flex-wrap justify-center gap-2">
        {config.items.map((i) => {
          if (placed[i.id]) return null
          const off = refused.includes(i.id)
          return (
            <button
              key={i.id}
              type="button"
              disabled={off}
              aria-pressed={selected === i.id}
              onPointerDown={(e) => onItemDown(e, i.id)}
              onPointerMove={onItemMove}
              onPointerUp={onItemUp}
              onPointerCancel={() => setDrag(null)}
              className={`touch-none rounded-2xl border-2 px-3 py-2 text-sm font-bold select-none ${off ? 'border-mist-deep bg-cotton/50 text-ink-soft line-through' : selected === i.id ? 'border-ink bg-butter text-ink' : 'border-cotton bg-cotton text-ink shadow-[0_3px_0_var(--color-mist-deep)]'} ${dragged?.id === i.id ? 'opacity-40' : ''}`}
            >
              {i.label}
            </button>
          )
        })}
      </div>
      {dragged && drag && (
        <span
          aria-hidden
          style={{ left: drag.x, top: drag.y }}
          className="pointer-events-none fixed z-20 -translate-x-1/2 -translate-y-[130%] rounded-2xl border-2 border-ink bg-butter px-3 py-2 text-sm font-bold text-ink"
        >
          {dragged.label}
        </span>
      )}
    </div>
  )
}
