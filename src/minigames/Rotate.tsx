import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { art } from '@/art'
import { sfx } from '@/audio'
import type { RotateConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import { Pin } from '@/ui/Pin'
import { angleDelta, angleOf, distance } from './geometry'
import { Note, type NoteData } from './Note'
import { FREE_MISSES, type MinigameProps } from './types'
import { useDone } from './useDone'

/** Degrees the dial gives when turned the wrong way, before that counts as a slip. */
export const WRONG_WAY_LIMIT = 25
/** Around the centre the direction of the finger jumps about; moves there are ignored. */
const DEAD_ZONE = 0.18
/** Degrees per arrow-key press. */
const KEY_STEP = 30
const SLIP_COST = 0.2
const MIN_ACCURACY = 0.4

/**
 * Turn a dial with a finger going round its centre. Only the right direction
 * makes progress; the wrong direction gives a little, then is refused with the
 * reason.
 */
export function Rotate({ config, artId, scene, onDone }: MinigameProps<RotateConfig>) {
  const goal = config.turns * 360
  const [turned, setTurned] = useState(0)
  /** How far the dial is currently pushed the wrong way. */
  const [back, setBack] = useState(0)
  const [grabbed, setGrabbed] = useState(false)
  const [note, setNote] = useState<NoteData | null>(null)
  const state = useRef({ turned: 0, back: 0, last: null as number | null, warned: false })
  const slips = useRef(0)
  const done = useDone(onDone)
  const finished = turned >= goal

  /** Apply a turn in degrees: positive is the right way. */
  const turn = (degrees: number) => {
    const s = state.current
    if (s.turned >= goal) return
    if (degrees < 0) {
      s.back = Math.min(WRONG_WAY_LIMIT, s.back - degrees)
      if (s.back >= WRONG_WAY_LIMIT && !s.warned) {
        s.warned = true
        slips.current += 1
        sfx('warn')
        setNote({ tone: 'bad', text: config.wrongWayNote })
      }
    } else {
      // Coming back from the wrong way first, then real progress.
      const undo = Math.min(s.back, degrees)
      s.back -= undo
      const before = s.turned
      s.turned = Math.min(goal, s.turned + degrees - undo)
      if (Math.floor(s.turned / 90) > Math.floor(before / 90) && s.turned < goal) sfx('tick')
      if (s.turned >= goal) {
        sfx('right')
        setGrabbed(false)
        setNote({ tone: 'good', text: config.doneNote })
        const counted = Math.max(0, slips.current - FREE_MISSES)
        done({ completed: true, accuracy: Math.max(MIN_ACCURACY, 1 - SLIP_COST * counted) })
      }
    }
    setTurned(s.turned)
    setBack(s.back)
  }

  /** Direction of the pointer from the dial's centre, or null when too close to it. */
  const directionOf = (e: PointerEvent<HTMLDivElement>): number | null => {
    const box = e.currentTarget.getBoundingClientRect()
    const centre = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    const pointer = { x: e.clientX, y: e.clientY }
    if (distance(centre, pointer) < (box.width / 2) * DEAD_ZONE) return null
    return angleOf(centre, pointer)
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (finished) return
    e.currentTarget.setPointerCapture(e.pointerId)
    state.current.last = directionOf(e)
    state.current.warned = false
    setGrabbed(true)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!grabbed || finished) return
    const now = directionOf(e)
    const { last } = state.current
    state.current.last = now
    if (now === null || last === null) return
    const clockwise = angleDelta(last, now)
    turn(config.direction === 'cw' ? clockwise : -clockwise)
  }
  const onUp = () => {
    setGrabbed(false)
    // Letting go lets the dial settle back from the wrong way.
    state.current.back = 0
    state.current.last = null
    setBack(0)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const clockwise = e.key === 'ArrowRight' ? KEY_STEP : -KEY_STEP
    state.current.warned = false
    turn(config.direction === 'cw' ? clockwise : -clockwise)
  }

  const share = Math.min(1, turned / goal)
  const shown = (config.direction === 'cw' ? 1 : -1) * (turned - back)
  const RING = 2 * Math.PI * 47

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={artId} scene={scene}>
        <Pin
          x={config.x}
          y={config.y}
          tone={finished ? 'done' : 'alert'}
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none"
        >
          {finished ? '✓' : '!'}
        </Pin>
      </SceneBox>
      <div className="flex items-center gap-3">
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Xoay: ${config.dial.label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(share * 100)}
          data-dial
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
          className="relative aspect-square w-[58%] max-w-56 shrink-0 touch-none rounded-full bg-cotton select-none [-webkit-touch-callout:none]"
        >
          <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full -rotate-90">
            <circle cx="50" cy="50" r="47" fill="none" stroke="var(--color-mist)" strokeWidth="5" />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="var(--color-mint-edge)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${RING * share} ${RING}`}
            />
          </svg>
          <img
            src={art(config.dial.art)}
            alt=""
            draggable={false}
            style={{ rotate: `${shown}deg` }}
            className="pointer-events-none absolute inset-[11%] size-[78%] object-contain select-none"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-display text-lg leading-tight font-bold text-ink">
            {config.dial.label}
          </p>
          <p className="text-sm leading-snug text-ink-soft">
            {finished
              ? 'Đã vặn chặt.'
              : 'Đặt ngón tay lên vành rồi xoay tròn quanh tâm. Nghĩ xem phải xoay chiều nào.'}
          </p>
          <p className="font-display text-base font-bold text-blue-ink tabular-nums">
            {Math.min(config.turns, Math.floor((turned / 360) * 10) / 10).toLocaleString('vi-VN')}/
            {config.turns} vòng
          </p>
        </div>
      </div>
      <Note note={note} idle={config.realityNote} />
    </div>
  )
}
