import type { ScoreResult } from './scoring'
import type { AreaDef, AreaId, LevelOutline } from './types'

/** Rewards, player level and unlock rules. Pure functions over the saved records. */

export interface LevelRecord {
  cleared: boolean
  bestScore: number
  stars: 0 | 1 | 2 | 3
  plays: number
}

export type Records = Record<string, LevelRecord | undefined>

export const XP_FIRST_CLEAR = 50
export const XP_THREE_STAR_BONUS = 25
export const XP_PER_PLAYER_LEVEL = 100

export interface Reward {
  xp: number
  firstClear: boolean
  threeStarBonus: boolean
}

export function playerLevel(xp: number): { level: number; into: number; needed: number } {
  return {
    level: Math.floor(xp / XP_PER_PLAYER_LEVEL) + 1,
    into: xp % XP_PER_PLAYER_LEVEL,
    needed: XP_PER_PLAYER_LEVEL,
  }
}

/** Fold one result into a level's record. Each reward is paid out once only. */
export function applyResult(
  prev: LevelRecord | undefined,
  result: Pick<ScoreResult, 'passed' | 'total' | 'stars'>,
): { record: LevelRecord; reward: Reward } {
  const firstClear = result.passed && !prev?.cleared
  const threeStarBonus = result.stars === 3 && (prev?.stars ?? 0) < 3
  const record: LevelRecord = {
    cleared: (prev?.cleared ?? false) || result.passed,
    bestScore: Math.max(prev?.bestScore ?? 0, result.passed ? result.total : 0),
    stars: Math.max(prev?.stars ?? 0, result.stars) as LevelRecord['stars'],
    plays: (prev?.plays ?? 0) + 1,
  }
  const xp = (firstClear ? XP_FIRST_CLEAR : 0) + (threeStarBonus ? XP_THREE_STAR_BONUS : 0)
  return { record, reward: { xp, firstClear, threeStarBonus } }
}

const levelsIn = (outline: LevelOutline[], areaId: AreaId) =>
  outline.filter((l) => l.areaId === areaId)

/**
 * Ids of areas and levels the player opened by hand, without clearing what comes
 * before them. Normal play never needs this; it exists so anyone can jump to any
 * level, for example when showing the game to someone.
 */
export type Opened = readonly string[]

/** An area opens once every level of the area before it is cleared, or when opened by hand. */
export function isAreaUnlocked(
  areas: AreaDef[],
  outline: LevelOutline[],
  records: Records,
  areaId: AreaId,
  opened: Opened = [],
): boolean {
  const index = areas.findIndex((a) => a.id === areaId)
  if (index <= 0) return index === 0
  if (opened.includes(areaId)) return true
  return levelsIn(outline, areas[index - 1].id).every((l) => records[l.id]?.cleared)
}

/**
 * A level opens once its area is open and the level before it is cleared.
 * A level opened by hand is open whatever the state of its area.
 */
export function isLevelUnlocked(
  areas: AreaDef[],
  outline: LevelOutline[],
  records: Records,
  levelId: string,
  opened: Opened = [],
): boolean {
  const level = outline.find((l) => l.id === levelId)
  if (!level) return false
  if (opened.includes(levelId)) return true
  if (!isAreaUnlocked(areas, outline, records, level.areaId, opened)) return false
  const siblings = levelsIn(outline, level.areaId)
  const index = siblings.findIndex((l) => l.id === levelId)
  return index === 0 || Boolean(records[siblings[index - 1].id]?.cleared)
}

/** The level the home screen should point at: the first one that is open but not cleared. */
export function nextLevelId(
  areas: AreaDef[],
  outline: LevelOutline[],
  records: Records,
  opened: Opened = [],
): string | null {
  const ordered = areas.flatMap((a) => levelsIn(outline, a.id))
  const next = ordered.find(
    (l) => !records[l.id]?.cleared && isLevelUnlocked(areas, outline, records, l.id, opened),
  )
  return next?.id ?? null
}
