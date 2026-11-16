import { useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { art } from '@/art'
import { sfx } from '@/audio'
import type { DragPlaceConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { Note, type NoteData } from './Note'
import { accuracyOf, type MinigameProps } from './types'
import { useDone } from './useDone'

const LETTERS = 'ABCDEF'

/** A press that moves further than this is a drag, not a tap. */
const DRAG_THRESHOLD_PX = 8
/** Under a finger the dragged item rides this far above the touch point, so it stays visible. */
const TOUCH_LIFT_PX = 48
/** An item dropped within this distance of a slot's centre lands in that slot. */
const SNAP_PX = 64

interface Drag {
  itemId: string
  startX: number
  startY: number
  /** Where the dragged item is drawn: the pointer, lifted above a finger. */
  x: number
  y: number
  moved: boolean
  lift: number
  /** The slot the item would land in if released now. */
  over: string | null
}

/** The slot nearest to a screen point, if any is close enough. */
function slotAt(x: number, y: number): string | null {
  let best: { id: string; distance: number } | null = null
  for (const el of document.querySelectorAll<HTMLElement>('[data-zone]')) {
    const box = el.getBoundingClientRect()
    const distance = Math.hypot(box.left + box.width / 2 - x, box.top + box.height / 2 - y)
    if (distance <= SNAP_PX && (!best || distance < best.distance)) {
      best = { id: el.dataset.zone!, distance }
    }
  }
  return best?.id ?? null
}

/**
 * Put each item where it belongs. Works two ways: drag an item onto a slot (the
 * item follows the pointer and the slot it would land in lights up), or tap an
 * item and then tap a slot. Decoy items must be left in the tray.
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
      sfx(item.zoneId === null ? 'warn' : 'wrong')
      setNote({ tone: item.zoneId === null ? 'bad' : 'warn', text: item.wrongNote })
      if (item.zoneId === null) setRefused((r) => [...r, itemId])
      return
    }
    const next = { ...placed, [itemId]: zoneId }
    setPlaced(next)
    sfx('hit')
    setNote({ tone: 'good', text: `${item.label}: đúng chỗ rồi!` })
    if (needed.every((i) => next[i.id])) {
      done({ completed: true, accuracy: accuracyOf(needed.length, misses.current) })
    }
  }

  const onItemDown = (e: PointerEvent<HTMLButtonElement>, itemId: string) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const lift = e.pointerType === 'touch' ? TOUCH_LIFT_PX : 0
    setDrag({
      itemId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY - lift,
      moved: false,
      lift,
      over: null,
    })
  }
  const onItemMove = (e: PointerEvent) => {
    if (!drag) return
    const far = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD_PX
    const moved = drag.moved || far
    const [x, y] = [e.clientX, e.clientY - drag.lift]
    // The drop goes where the picture is, not where the finger hides the scene.
    setDrag({ ...drag, x, y, moved, over: moved ? slotAt(x, y) : null })
  }
  const onItemUp = () => {
    if (!drag) return
    setDrag(null)
    if (!drag.moved) {
      // A tap: pick the item up, or put it back down.
      setSelected((s) => (s === drag.itemId ? null : drag.itemId))
      return
    }
    if (drag.over) attempt(drag.itemId, drag.over)
  }

  const dragged = drag?.moved ? itemOf(drag.itemId) : undefined

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene}>
        {config.zones.map((z, i) => {
          const here = config.items.find((item) => placed[item.id] === z.id)
          const target = drag?.over === z.id
          return (
            <Pin
              key={z.id}
              x={z.x}
              y={z.y}
              dashed={!here}
              tone={here ? 'done' : target ? 'alert' : selected || dragged ? 'todo' : 'idle'}
              data-zone={z.id}
              aria-label={`Vị trí: ${z.label}`}
              onClick={() => selected && attempt(selected, z.id)}
              className={`!size-12 transition-transform ${target ? 'z-10 scale-125' : ''}`}
            >
              {here ? (
                <img src={art(here.art)} alt="" className="size-9 object-contain" />
              ) : (
                LETTERS[i]
              )}
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
      <div className="grid grid-cols-3 gap-2">
        {config.items.map((i) => {
          // An item that was placed, or a decoy that was tried and refused, leaves the tray.
          if (placed[i.id] || refused.includes(i.id)) return null
          return (
            <button
              key={i.id}
              type="button"
              aria-label={i.label}
              aria-pressed={selected === i.id}
              onPointerDown={(e) => onItemDown(e, i.id)}
              onPointerMove={onItemMove}
              onPointerUp={onItemUp}
              onPointerCancel={() => setDrag(null)}
              className={`flex touch-none flex-col items-center gap-1 rounded-2xl border-2 px-1.5 py-2 text-center text-xs leading-tight font-bold select-none [-webkit-touch-callout:none] ${selected === i.id ? 'border-ink bg-butter text-ink' : 'border-mist-edge bg-cotton text-ink shadow-[0_3px_0_var(--color-mist-edge)]'} ${dragged?.id === i.id ? 'opacity-30' : ''}`}
            >
              <img src={art(i.art)} alt="" draggable={false} className="size-14 object-contain" />
              {i.label}
            </button>
          )
        })}
      </div>
      {dragged &&
        drag &&
        // Drawn at the top of the page, so nothing between here and there can offset it.
        createPortal(
          <span
            aria-hidden
            style={{ left: drag.x, top: drag.y }}
            className="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          >
            <img
              src={art(dragged.art)}
              alt=""
              className="size-20 object-contain drop-shadow-[0_4px_0_var(--color-ink-soft)]"
            />
          </span>,
          document.body,
        )}
    </div>
  )
}
