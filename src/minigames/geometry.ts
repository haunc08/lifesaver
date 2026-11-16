/**
 * Geometry for the gesture mini-games. Pure functions, no React.
 *
 * Content places things on a scene in percent of its width and height. A scene
 * is 4:3, so a percent across is longer than a percent down. Distances are
 * therefore measured in "units": percent of the scene's width in both
 * directions. A point in units is `{ x, y * SCENE_RATIO }`.
 */

export interface Point {
  x: number
  y: number
}

/** Height of a scene divided by its width. */
export const SCENE_RATIO = 0.75

/** Scene percent to units. */
export function toUnits(p: Point): Point {
  return { x: p.x, y: p.y * SCENE_RATIO }
}

/** Units back to scene percent. */
export function toPercent(p: Point): Point {
  return { x: p.x, y: p.y / SCENE_RATIO }
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** Total length of a path of straight pieces. */
export function pathLength(path: Point[]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) total += distance(path[i - 1], path[i])
  return total
}

/** The point this far along the path, clamped to its two ends. */
export function pointAlong(path: Point[], along: number): Point {
  let left = Math.max(0, along)
  for (let i = 1; i < path.length; i++) {
    const piece = distance(path[i - 1], path[i])
    if (left <= piece && piece > 0) {
      const t = left / piece
      return {
        x: path[i - 1].x + (path[i].x - path[i - 1].x) * t,
        y: path[i - 1].y + (path[i].y - path[i - 1].y) * t,
      }
    }
    left -= piece
  }
  return path[path.length - 1]
}

/** The place on the whole path nearest to `p`. */
export function nearestOnPath(path: Point[], p: Point): { along: number; distance: number } {
  let best = { along: 0, distance: Infinity }
  let start = 0
  for (let i = 1; i < path.length; i++) {
    const [a, b] = [path[i - 1], path[i]]
    const piece = distance(a, b)
    if (piece > 0) {
      const raw = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (piece * piece)
      const t = Math.min(1, Math.max(0, raw))
      const d = distance(p, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      if (d < best.distance) best = { along: start + piece * t, distance: d }
    }
    start += piece
  }
  return best
}

/** Step used when walking along a path, in units. */
const WALK_STEP = 0.5

/**
 * How far something at `from` on the path can follow a finger at `p`: walk
 * forward along the path for as long as that brings it closer to the finger, at
 * most `reach` further. Walking, rather than jumping to the nearest place,
 * matters for paths that zigzag or loop: a later pass that lies close to the
 * finger is not reached by cutting across.
 *
 * Going round a bend first leads away from a finger that has cut the corner, so
 * the walk carries on through a rise for as long as the finger stays within
 * `slack` of it.
 */
export function followPath(
  path: Point[],
  p: Point,
  from: number,
  reach: number,
  slack = 0,
): { along: number; distance: number } {
  const end = Math.min(pathLength(path), from + reach)
  let best = { along: from, distance: distance(p, pointAlong(path, from)) }
  for (let at = from + WALK_STEP; at < end + WALK_STEP; at += WALK_STEP) {
    const along = Math.min(at, end)
    const d = distance(p, pointAlong(path, along))
    if (d > Math.max(best.distance, slack)) break
    if (d <= best.distance) best = { along, distance: d }
  }
  return best
}

/** Direction from a centre to a point, in degrees. On a screen (y grows downward) it grows clockwise. */
export function angleOf(centre: Point, p: Point): number {
  return (Math.atan2(p.y - centre.y, p.x - centre.x) * 180) / Math.PI
}

/** The shortest turn from one direction to another, in degrees: positive is clockwise on a screen. */
export function angleDelta(from: number, to: number): number {
  const d = (((to - from) % 360) + 540) % 360
  return d - 180
}
