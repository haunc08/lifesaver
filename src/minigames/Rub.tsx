import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { art } from '@/art'
import { sfx } from '@/audio'
import type { RubConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { distance, SCENE_RATIO, toUnits, type Point } from './geometry'
import { Note, type NoteData } from './Note'
import type { MinigameProps } from './types'
import { useDone } from './useDone'

/** Distances are in units: percent of the picture's width (see geometry.ts). */

/** The tool rubs a place while it is this close to the place's centre. */
export const RUB_RADIUS = 9
/** How far the tool must travel over a place before the place is done. */
export const RUB_TRAVEL = 45
/** Travel counted for one move at most, so a jump across the picture is not a rub. */
const MAX_STEP = 6
/** Under a finger the tool rides this far above the touch point, so it stays visible. */
const TOUCH_LIFT_PX = 44
/** Share of a place one key press covers, for players without a pointer. */
const KEY_STEP = 1 / 3

interface Drag {
  /** Where the tool is drawn on the page. */
  x: number
  y: number
  lift: number
  /** Where the tool was on the picture at the last move, in units. */
  last: Point | null
}

/**
 * Rub a tool back and forth over each marked place. Only movement counts:
 * resting the tool on a place does nothing. Press on the picture or on the tool
 * under it, and the tool follows the finger.
 */
export function Rub({ config, artId, scene, onDone }: MinigameProps<RubConfig>) {
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [drag, setDrag] = useState<Drag | null>(null)
  const [note, setNote] = useState<NoteData | null>(null)
  const totals = useRef<Record<string, number>>({})
  const surface = useRef<HTMLDivElement>(null)
  const done = useDone(onDone)

  const shareOf = (id: string) => Math.min(1, progress[id] ?? 0)
  const finished = config.spots.every((s) => shareOf(s.id) >= 1)

  /** Add to a place's progress; returns true when that finished the place. */
  const add = (id: string, amount: number) => {
    const before = totals.current[id] ?? 0
    if (before >= 1) return
    const after = Math.min(1, before + amount)
    totals.current = { ...totals.current, [id]: after }
    setProgress(totals.current)
    if (after < 1) return
    const spot = config.spots.find((s) => s.id === id)!
    if (config.spots.every((s) => (totals.current[s.id] ?? 0) >= 1)) {
      setDrag(null)
      sfx('right')
      setNote({ tone: 'good', text: config.doneNote })
      done({ completed: true, accuracy: 1 })
    } else {
      sfx('hit')
      setNote({ tone: 'good', text: `${spot.label}: xong rồi!` })
    }
  }

  /** A point on the page as a point on the picture, in units. */
  const onPicture = (x: number, y: number): Point | null => {
    const box = surface.current?.getBoundingClientRect()
    if (!box) return null
    return {
      x: ((x - box.left) / box.width) * 100,
      y: ((y - box.top) / box.height) * 100 * SCENE_RATIO,
    }
  }

  const onDown = (e: PointerEvent<HTMLElement>) => {
    if (finished) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const lift = e.pointerType === 'touch' ? TOUCH_LIFT_PX : 0
    const [x, y] = [e.clientX, e.clientY - lift]
    setDrag({ x, y, lift, last: onPicture(x, y) })
    setNote(null)
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag || finished) return
    const [x, y] = [e.clientX, e.clientY - drag.lift]
    const here = onPicture(x, y)
    setDrag({ ...drag, x, y, last: here })
    if (!here || !drag.last) return
    const travelled = Math.min(MAX_STEP, distance(here, drag.last))
    for (const spot of config.spots) {
      if (distance(here, toUnits(spot)) <= RUB_RADIUS) add(spot.id, travelled / RUB_TRAVEL)
    }
  }

  const gesture = {
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: () => setDrag(null),
    onPointerCancel: () => setDrag(null),
  }

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    add(id, KEY_STEP)
  }

  const radius = RUB_RADIUS - 1.5
  const ring = 2 * Math.PI * radius

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={config.art ?? artId} scene={scene}>
        <svg
          viewBox={`0 0 100 ${100 * SCENE_RATIO}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        >
          {config.spots.map((s, i) => {
            const share = shareOf(s.id)
            const centre = toUnits(s)
            return (
              <g key={s.id} transform={`translate(${centre.x} ${centre.y})`}>
                {/* The place fills in as it is rubbed. */}
                <circle
                  r={radius}
                  fill={share >= 1 ? 'var(--color-mint)' : 'var(--color-blue)'}
                  fillOpacity={share >= 1 ? 0.8 : 0.15 + 0.5 * share}
                  stroke="var(--color-cotton)"
                  strokeWidth="1.2"
                  strokeDasharray={share >= 1 ? undefined : '2.2 1.8'}
                />
                <circle
                  r={radius}
                  fill="none"
                  stroke="var(--color-mint-edge)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray={`${ring * share} ${ring}`}
                  transform="rotate(-90)"
                />
                <text
                  y="1.9"
                  textAnchor="middle"
                  fontSize="5.4"
                  fontWeight="700"
                  fill="var(--color-ink)"
                  className="font-display"
                >
                  {share >= 1 ? '✓' : i + 1}
                </text>
              </g>
            )
          })}
        </svg>
        <div
          ref={surface}
          data-surface
          {...gesture}
          className="absolute inset-0 touch-none select-none [-webkit-touch-callout:none]"
        />
      </SceneBox>
      <ul className="grid grid-cols-2 gap-2">
        {config.spots.map((s, i) => {
          const share = shareOf(s.id)
          return (
            <li
              key={s.id}
              role="progressbar"
              tabIndex={0}
              aria-label={s.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(share * 100)}
              onKeyDown={(e) => onKey(e, s.id)}
              className={`flex min-h-10 items-center gap-2 rounded-2xl border-2 px-2.5 py-1 text-sm leading-tight font-bold ${share >= 1 ? 'border-mint-edge bg-mint/40' : 'border-mist-edge bg-cotton'}`}
            >
              <span
                aria-hidden
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display ${share >= 1 ? 'bg-mint' : 'bg-mist'}`}
              >
                {share >= 1 ? '✓' : i + 1}
              </span>
              {s.label}
            </li>
          )
        })}
      </ul>
      <Note note={note} idle="Chà qua lại lên từng vòng tròn trên hình cho đến khi vòng đầy." />
      <button
        type="button"
        aria-label={`Giữ và kéo lên hình: ${config.tool.label}`}
        {...gesture}
        className={`flex w-full touch-none items-center gap-3 rounded-3xl border-2 border-mist-edge bg-cotton px-4 py-2 text-left font-display text-lg leading-tight font-bold text-ink shadow-[0_4px_0_var(--color-mist-edge)] select-none [-webkit-touch-callout:none] ${drag ? 'opacity-40' : ''}`}
      >
        <img
          src={art(config.tool.art)}
          alt=""
          draggable={false}
          className="size-14 shrink-0 object-contain"
        />
        <span>
          {config.tool.label}
          <span className="block font-sans text-sm font-normal text-ink-soft">
            Giữ rồi kéo lên hình, hoặc ấn thẳng vào hình
          </span>
        </span>
      </button>
      <p className="px-1 text-center text-sm text-ink-soft">{config.realityNote}</p>
      {drag &&
        // Drawn at the top of the page, so nothing between here and there can offset it.
        createPortal(
          <span
            aria-hidden
            data-tool
            style={{ left: drag.x, top: drag.y }}
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src={art(config.tool.art)}
              alt=""
              className="size-20 object-contain drop-shadow-[0_4px_0_var(--color-ink-soft)]"
            />
          </span>,
          document.body,
        )}
    </div>
  )
}
