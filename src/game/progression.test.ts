import { describe, expect, it } from 'vitest'
import {
  applyResult,
  isAreaUnlocked,
  isLevelUnlocked,
  nextLevelId,
  playerLevel,
  XP_FIRST_CLEAR,
  XP_THREE_STAR_BONUS,
  type LevelRecord,
} from './progression'
import type { AreaDef, LevelOutline } from './types'

const areas: AreaDef[] = [
  { id: 'school', name: 'A', tagline: '', emoji: '' },
  { id: 'dormitory', name: 'B', tagline: '', emoji: '' },
]
const outline: LevelOutline[] = [
  { id: 's1', areaId: 'school', title: '', theme: '' },
  { id: 's2', areaId: 'school', title: '', theme: '' },
  { id: 'd1', areaId: 'dormitory', title: '', theme: '' },
]
const cleared: LevelRecord = { cleared: true, bestScore: 80, stars: 2, plays: 1 }

describe('applyResult', () => {
  it('pays the first-clear reward once', () => {
    const first = applyResult(undefined, { passed: true, total: 80, stars: 2 })
    expect(first.reward).toEqual({ xp: XP_FIRST_CLEAR, firstClear: true, threeStarBonus: false })

    const again = applyResult(first.record, { passed: true, total: 80, stars: 2 })
    expect(again.reward.xp).toBe(0)
    expect(again.record.plays).toBe(2)
  })

  it('pays the 3-star bonus once, even when earned on a replay', () => {
    const replay = applyResult(cleared, { passed: true, total: 95, stars: 3 })
    expect(replay.reward).toEqual({
      xp: XP_THREE_STAR_BONUS,
      firstClear: false,
      threeStarBonus: true,
    })
    expect(applyResult(replay.record, { passed: true, total: 95, stars: 3 }).reward.xp).toBe(0)
  })

  it('keeps the best result and gives nothing for a failed run', () => {
    const failed = applyResult(cleared, { passed: false, total: 40, stars: 0 })
    expect(failed.reward.xp).toBe(0)
    expect(failed.record).toMatchObject({ cleared: true, bestScore: 80, stars: 2, plays: 2 })
  })
})

describe('unlock rules', () => {
  it('opens only the first level of the first area for a new player', () => {
    expect(isLevelUnlocked(areas, outline, {}, 's1')).toBe(true)
    expect(isLevelUnlocked(areas, outline, {}, 's2')).toBe(false)
    expect(isAreaUnlocked(areas, outline, {}, 'dormitory')).toBe(false)
    expect(nextLevelId(areas, outline, {})).toBe('s1')
  })

  it('opens the next level, then the next area, as levels are cleared', () => {
    expect(isLevelUnlocked(areas, outline, { s1: cleared }, 's2')).toBe(true)
    expect(isAreaUnlocked(areas, outline, { s1: cleared }, 'dormitory')).toBe(false)

    const both = { s1: cleared, s2: cleared }
    expect(isAreaUnlocked(areas, outline, both, 'dormitory')).toBe(true)
    expect(nextLevelId(areas, outline, both)).toBe('d1')
  })

  it('has no next level once everything is cleared', () => {
    expect(nextLevelId(areas, outline, { s1: cleared, s2: cleared, d1: cleared })).toBeNull()
  })
})

describe('playerLevel', () => {
  it('starts at level 1 and gains a level every 100 XP', () => {
    expect(playerLevel(0)).toMatchObject({ level: 1, into: 0 })
    expect(playerLevel(250)).toMatchObject({ level: 3, into: 50 })
  })
})
