import { describe, expect, it } from 'vitest'
import { initialState, step, summarize, type LevelEvent } from '@/game/levelMachine'
import { score } from '@/game/scoring'
import { PHASES, type LevelDef, type SingleMinigameConfig } from '@/game/types'
import { AREAS } from './areas'
import { LEVEL_OUTLINE, LEVELS } from './levels'

/**
 * Content rules every level must meet. These run over every level file, so a new
 * level is checked as soon as it is added to src/content/levels.
 */

const levels = Object.values(LEVELS).filter((l): l is LevelDef => l !== undefined)
const OUTCOMES = ['success', 'partial-success', 'recoverable-mistake', 'unsafe-failure', 'timeout']

const inScene = (p: { x: number; y: number }) => p.x >= 6 && p.x <= 94 && p.y >= 8 && p.y <= 92
const unique = (ids: string[]) => new Set(ids).size === ids.length

function checkMinigame(config: SingleMinigameConfig) {
  expect(config.instruction.trim()).not.toBe('')
  switch (config.type) {
    case 'tap-targets':
      expect(config.targets.length).toBeGreaterThanOrEqual(2)
      expect(unique(config.targets.map((t) => t.id))).toBe(true)
      expect(config.targets.every(inScene)).toBe(true)
      break
    case 'scan':
      expect(config.spots.filter((s) => s.hazard).length).toBeGreaterThanOrEqual(2)
      expect(config.spots.filter((s) => !s.hazard).length).toBeGreaterThanOrEqual(1)
      expect(unique(config.spots.map((s) => s.id))).toBe(true)
      expect(config.spots.every(inScene)).toBe(true)
      expect(config.spots.every((s) => s.note.trim() !== '')).toBe(true)
      break
    case 'hold':
      expect(config.holdSec).toBeGreaterThanOrEqual(3)
      expect(config.holdSec).toBeLessThanOrEqual(8)
      expect(config.realityNote.trim()).not.toBe('')
      break
    case 'drag-place': {
      const zoneIds = config.zones.map((z) => z.id)
      expect(unique(zoneIds)).toBe(true)
      expect(unique(config.items.map((i) => i.id))).toBe(true)
      expect(config.zones.every(inScene)).toBe(true)
      expect(config.items.filter((i) => i.zoneId !== null).length).toBeGreaterThanOrEqual(2)
      for (const item of config.items) {
        if (item.zoneId !== null) expect(zoneIds).toContain(item.zoneId)
        expect(item.wrongNote.trim()).not.toBe('')
      }
      // Every zone is used, so no zone is a dead end.
      for (const id of zoneIds) expect(config.items.some((i) => i.zoneId === id)).toBe(true)
      break
    }
    case 'quick-decision':
      expect(config.cards.length).toBeGreaterThanOrEqual(4)
      expect(config.secPerCard).toBeGreaterThanOrEqual(6)
      expect(config.secPerCard).toBeLessThanOrEqual(10)
      expect(new Set(config.cards.map((c) => c.answer)).size).toBe(2)
      expect(config.cards.every((c) => c.why.trim() !== '')).toBe(true)
      break
  }
}

/** Plays the level with no mistakes, taking `seconds` of clock time. */
function perfectRun(level: LevelDef, seconds: number) {
  const events: LevelEvent[] = [
    { type: 'intro-done' },
    ...level.observe.clues.map((c): LevelEvent => ({ type: 'clue-found', id: c.id })),
    { type: 'observe-done' },
    { type: 'assess-answer', id: level.assess.options.find((o) => o.correct)!.id },
    { type: 'tick', ms: seconds * 1000 },
    ...level.choose.order.map((id): LevelEvent => ({ type: 'pick', id })),
    { type: 'confirm-solution' },
    { type: 'act-done', result: { completed: true, accuracy: 1 } },
  ]
  const state = events.reduce((s, e) => step(level, s, e), initialState())
  return score(summarize(level, state))
}

describe('level list', () => {
  it('has every area represented and no level outside the outline', () => {
    for (const area of AREAS) {
      expect(LEVEL_OUTLINE.some((l) => l.areaId === area.id)).toBe(true)
    }
    for (const level of levels) {
      const outline = LEVEL_OUTLINE.find((l) => l.id === level.id)
      expect(outline, `${level.id} is not in LEVEL_OUTLINE`).toBeDefined()
      expect(level.areaId).toBe(outline!.areaId)
      expect(level.title).toBe(outline!.title)
    }
  })
})

describe.each(levels.map((l) => [l.id, l] as const))('level %s', (_id, level) => {
  it('has a readable intro, enough clues and a fair clock', () => {
    expect(level.intro.length).toBeGreaterThanOrEqual(3)
    expect(level.intro.length).toBeLessThanOrEqual(6)
    expect(level.observe.required).toBeGreaterThanOrEqual(2)
    expect(level.observe.clues.length).toBeGreaterThanOrEqual(level.observe.required)
    expect(unique(level.observe.clues.map((c) => c.id))).toBe(true)
    expect(level.observe.clues.every(inScene)).toBe(true)
    expect(level.timeLimitSec).toBeGreaterThanOrEqual(75)
    expect(level.timeLimitSec).toBeLessThanOrEqual(150)
  })

  it('has exactly one right assessment among 3–4 options', () => {
    expect(level.assess.options.length).toBeGreaterThanOrEqual(3)
    expect(level.assess.options.length).toBeLessThanOrEqual(4)
    expect(level.assess.options.filter((o) => o.correct)).toHaveLength(1)
    expect(unique(level.assess.options.map((o) => o.id))).toBe(true)
  })

  it('offers all four kinds of solution, with safety and calling for help mandatory', () => {
    const { options, order } = level.choose
    expect(unique(options.map((o) => o.id))).toBe(true)
    expect(options.length).toBeGreaterThanOrEqual(6)
    expect(options.length).toBeLessThanOrEqual(8)
    for (const kind of ['correct', 'partial', 'unsafe', 'irrelevant']) {
      expect(
        options.some((o) => o.kind === kind),
        `no ${kind} option`,
      ).toBe(true)
    }
    const correctIds = options.filter((o) => o.kind === 'correct').map((o) => o.id)
    expect([...order].sort()).toEqual([...correctIds].sort())
    expect(options.filter((o) => o.mandatory).length).toBeGreaterThanOrEqual(2)
    for (const o of options) {
      expect(o.feedback.trim()).not.toBe('')
      if (o.mandatory) expect(o.kind).toBe('correct')
      if (o.kind === 'partial') expect(correctIds).toContain(o.substitutes)
      else expect(o.substitutes).toBeUndefined()
    }
    // The options must not be listed in the answer order.
    expect(correctIds).not.toEqual(order)
  })

  it('has a valid mini-game', () => {
    if (level.act.type === 'sequence') {
      expect(level.act.steps.length).toBeGreaterThanOrEqual(2)
      expect(level.act.steps.length).toBeLessThanOrEqual(3)
      level.act.steps.forEach(checkMinigame)
    } else {
      checkMinigame(level.act)
    }
  })

  it('has text for every outcome and a hint for every phase', () => {
    for (const outcome of OUTCOMES) {
      expect(level.outcomes[outcome as keyof typeof level.outcomes].trim()).not.toBe('')
    }
    for (const phase of PHASES) expect(level.hints[phase].trim()).not.toBe('')
  })

  it('has a draft lesson tied to the level', () => {
    const { lesson } = level
    expect(lesson.id).toBe(`lesson-${level.id}`)
    expect(lesson.levelId).toBe(level.id)
    expect(lesson.areaId).toBe(level.areaId)
    for (const list of [lesson.signs, lesson.principles, lesson.donts, lesson.callForHelp]) {
      expect(list.length).toBeGreaterThanOrEqual(2)
    }
    // Only a qualified reviewer may fill these in.
    expect([lesson.source, lesson.reviewer, lesson.reviewedOn]).toEqual([null, null, null])
  })

  it('gives three stars for a quick, flawless run and still passes a slow one', () => {
    const quick = perfectRun(level, level.timeLimitSec * 0.3)
    expect(quick.outcome).toBe('success')
    expect(quick.stars).toBe(3)
    const slow = perfectRun(level, level.timeLimitSec * 0.95)
    expect(slow.passed).toBe(true)
  })
})
