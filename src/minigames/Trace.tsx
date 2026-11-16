import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { art } from '@/art'
import { sfx } from '@/audio'
import type { TraceConfig } from '@/game/types'
import { SceneBox } from '@/screens/level/SceneBox'
import {
  distance,
  followPath,
  nearestOnPath,
  pathLength,
  pointAlong,
  SCENE_RATIO,
  toPercent,
  toUnits,
  type Point,
} from './geometry'
import { Note, type NoteData } from './Note'
import { FREE_MISSES, type MinigameProps } from './types'
import { useDone } from './useDone'

/** Distances are in units: percent of the picture's width (see geometry.ts). */

/** A press this close to the tool picks it up. */
export const GRAB = 13
/** The tool follows while the finger is this close to the path. */
export const ON_PATH = 8
/** A finger further than this from the path has left it: a slip. */
export const STRAY = 16
/** How far along the path the tool can catch up with the finger in one move. */
const REACH = 14
/** How far the finger may cut a corner and still take the tool round it. */
const CORNER_SLACK = 4
/** The path counts as finished this close to its end. */
const END_SLACK = 1.5
/** A gentle path: faster than this, in units per second, is a slip. */
export const GENTLE_MAX_SPEED = 60
/** Speed is averaged over at least this long, so one jumpy reading does not count. */
const SPEED_WINDOW_MS = 120
const SLIP_COST = 0.2
const MIN_ACCURACY = 0.4
/** Share of the path one arrow-key press covers. */
const KEY_STEP = 1 / 8

/**
 * Move a tool along a dotted path to its end. The tool follows the finger for
 * as long as the finger stays near the path; leaving the path is a slip, and
 * the tool waits where it was until it is picked up again.
 */
export function Trace({ config, artId, scene, onDone }: MinigameProps<TraceConfig>) {
  const path = useMemo(() => config.path.map(toUnits), [config.path])
  const total = useMemo(() => pathLength(path), [path])
  const speckAt = useMemo(
    () => (config.speck ? nearestOnPath(path, toUnits(config.speck)).along : null),
    [config.speck, path],
  )

  const [along, setAlong] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [note, setNote] = useState<NoteData | null>(null)
  const position = useRef(0)
  const slips = useRef(0)
  /** Recent readings of time and place, for the speed of a gentle path. */
  const readings = useRef<{ at: number; along: number }[]>([])
  const done = useDone(onDone)
  const finished = along >= total - END_SLACK

  const unitsAt = (e: PointerEvent<HTMLDivElement>): Point => {
    const box = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100 * SCENE_RATIO,
    }
  }

  const moveTo = (next: number) => {
    position.current = next
    setAlong(next)
    if (next < total - END_SLACK) return
    setDragging(false)
    sfx('right')
    setNote({ tone: 'good', text: config.doneNote })
    const counted = Math.max(0, slips.current - FREE_MISSES)
    done({ completed: true, accuracy: Math.max(MIN_ACCURACY, 1 - SLIP_COST * counted) })
  }

  const slip = () => {
    slips.current += 1
    setDragging(false)
    sfx('wrong')
    setNote({ tone: 'warn', text: config.slipNote })
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (finished) return
    if (distance(unitsAt(e), pointAlong(path, position.current)) > GRAB) {
      setNote({
        tone: 'warn',
        text: `Chạm vào ${config.tool.label.toLowerCase()} rồi mới kéo nhé.`,
      })
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    readings.current = [{ at: e.timeStamp, along: position.current }]
    setDragging(true)
    setNote(null)
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || finished) return
    const here = position.current
    const near = followPath(path, unitsAt(e), here, REACH, CORNER_SLACK)
    if (near.distance > STRAY) return slip()
    if (near.distance > ON_PATH || near.along <= here) return
    if (config.gentle) {
      const log = readings.current
      log.push({ at: e.timeStamp, along: near.along })
      // Keep one reading older than the window, to measure from.
      while (log.length > 2 && e.timeStamp - log[1].at >= SPEED_WINDOW_MS) log.shift()
      const elapsed = e.timeStamp - log[0].at
      if (elapsed >= SPEED_WINDOW_MS) {
        const speed = ((near.along - log[0].along) / elapsed) * 1000
        if (speed > GENTLE_MAX_SPEED) return slip()
      }
    }
    moveTo(near.along)
  }

  const onKey = (e: KeyboardEvent) => {
    if (finished || (e.key !== 'ArrowRight' && e.key !== 'Enter' && e.key !== ' ')) return
    e.preventDefault()
    moveTo(Math.min(total, position.current + total * KEY_STEP))
  }

  const points = path.map((p) => `${p.x},${p.y}`).join(' ')
  const end = path[path.length - 1]
  const tool = toPercent(pointAlong(path, along))
  const share = Math.min(1, along / total)

  return (
    <div className="space-y-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <SceneBox artId={config.art ?? artId} scene={scene}>
        <svg
          viewBox={`0 0 100 ${100 * SCENE_RATIO}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* The dotted guide, on a pale line so it shows on any picture. */}
          <polyline
            points={points}
            stroke="var(--color-cotton)"
            strokeOpacity=".7"
            strokeWidth="2.4"
          />
          <polyline
            points={points}
            stroke="var(--color-ink)"
            strokeWidth="1"
            strokeDasharray="0.1 2.8"
          />
          <circle
            cx={end.x}
            cy={end.y}
            r="3"
            fill="var(--color-cotton)"
            stroke="var(--color-ink)"
            strokeWidth="0.9"
            strokeDasharray="1.6 1.4"
          />
          {config.trail === 'band' && along > 0 && (
            <>
              <polyline
                points={points}
                stroke="var(--color-mist-edge)"
                strokeWidth="8.6"
                strokeDasharray={`${along} ${total + 10}`}
              />
              <polyline
                points={points}
                stroke="var(--color-cotton)"
                strokeWidth="7"
                strokeDasharray={`${along} ${total + 10}`}
              />
            </>
          )}
          {config.speck && speckAt !== null && along < speckAt && (
            <line
              x1={config.speck.x - 0.6}
              y1={config.speck.y * SCENE_RATIO + 0.4}
              x2={config.speck.x + 0.9}
              y2={config.speck.y * SCENE_RATIO - 3}
              stroke="var(--color-ink)"
              strokeWidth="1.1"
            />
          )}
        </svg>
        <img
          src={art(config.tool.art)}
          alt=""
          draggable={false}
          data-tool
          style={{ left: `${tool.x}%`, top: `${tool.y}%`, width: `${config.tool.size ?? 16}%` }}
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-[0_3px_0_var(--color-ink-soft)] transition-[scale] duration-150 ${dragging ? 'scale-110' : ''}`}
        />
        {/* The whole picture takes the gesture, so the finger may drift off the tool. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={config.tool.label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(share * 100)}
          data-surface
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={onKey}
          className="absolute inset-0 touch-none select-none [-webkit-touch-callout:none]"
        />
      </SceneBox>
      <div
        className="h-4 overflow-hidden rounded-full border-[3px] border-cotton bg-cotton"
        aria-hidden
      >
        <div className="h-full rounded-full bg-mint-edge" style={{ width: `${share * 100}%` }} />
      </div>
      <Note
        note={note}
        idle={`Giữ ${config.tool.label.toLowerCase()} và kéo theo đường chấm đến vòng tròn.${config.gentle ? ' Kéo thật chậm.' : ''}`}
      />
      <p className="px-1 text-center text-sm text-ink-soft">{config.realityNote}</p>
    </div>
  )
}
