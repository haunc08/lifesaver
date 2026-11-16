import { describe, expect, it } from 'vitest'
import {
  angleDelta,
  angleOf,
  followPath,
  nearestOnPath,
  pathLength,
  pointAlong,
  toPercent,
  toUnits,
} from './geometry'

const L = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
]

describe('units', () => {
  it('scales the vertical direction of a 4:3 scene and back', () => {
    expect(toUnits({ x: 40, y: 40 })).toEqual({ x: 40, y: 30 })
    expect(toPercent(toUnits({ x: 12, y: 80 }))).toEqual({ x: 12, y: 80 })
  })
})

describe('paths', () => {
  it('measures a path and finds points along it', () => {
    expect(pathLength(L)).toBe(20)
    expect(pointAlong(L, 5)).toEqual({ x: 5, y: 0 })
    expect(pointAlong(L, 15)).toEqual({ x: 10, y: 5 })
    expect(pointAlong(L, -3)).toEqual({ x: 0, y: 0 })
    expect(pointAlong(L, 99)).toEqual({ x: 10, y: 10 })
  })

  it('finds the nearest place on the path', () => {
    expect(nearestOnPath(L, { x: 4, y: 3 })).toEqual({ along: 4, distance: 3 })
    expect(nearestOnPath(L, { x: 13, y: 6 })).toEqual({ along: 16, distance: 3 })
  })

  // A hairpin: out along the top, back along a line just below it.
  const hairpin = [
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 20, y: 2 },
    { x: 0, y: 2 },
  ]

  it('follows a finger forward along the path, no further than the reach', () => {
    expect(followPath(hairpin, { x: 6, y: 1 }, 2, 14)).toEqual({ along: 6, distance: 1 })
    expect(followPath(hairpin, { x: 19, y: 0 }, 2, 5).along).toBe(7)
  })

  it('goes round a bend only when the finger has cut the corner by less than the slack', () => {
    // The tool is just before the bend, the finger just after it.
    expect(followPath(hairpin, { x: 18, y: 2 }, 19, 14)).toEqual({
      along: 19,
      distance: Math.hypot(1, 2),
    })
    expect(followPath(hairpin, { x: 18, y: 2 }, 19, 14, 4)).toEqual({ along: 24, distance: 0 })
  })

  it('does not cut across to a later pass that lies close to the finger', () => {
    // The finger sits on the way back, right under the start of the way out.
    const finger = { x: 5, y: 2 }
    expect(nearestOnPath(hairpin, finger).along).toBe(37)
    expect(followPath(hairpin, finger, 2, 40)).toEqual({ along: 5, distance: 2 })
    expect(followPath(hairpin, finger, 2, 40, 4)).toEqual({ along: 5, distance: 2 })
    // And it never goes backward.
    expect(followPath(hairpin, { x: 1, y: 0 }, 8, 14).along).toBe(8)
  })
})

describe('angles', () => {
  it('grows clockwise on a screen, where y points down', () => {
    const centre = { x: 0, y: 0 }
    expect(angleOf(centre, { x: 1, y: 0 })).toBe(0)
    expect(angleOf(centre, { x: 0, y: 1 })).toBe(90)
    expect(angleOf(centre, { x: 0, y: -1 })).toBe(-90)
  })

  it('takes the shortest turn, also across the ±180 seam', () => {
    expect(angleDelta(10, 40)).toBe(30)
    expect(angleDelta(40, 10)).toBe(-30)
    expect(angleDelta(170, -170)).toBe(20)
    expect(angleDelta(-170, 170)).toBe(-20)
  })
})
