import { describe, expect, it } from 'vitest'
import {
  CHOOSE_TIME_SEC,
  initialState,
  step,
  summarize,
  type LevelEvent,
} from '@/game/levelMachine'
import { score } from '@/game/scoring'
import { PHASES, type LevelDef, type SingleMinigameConfig } from '@/game/types'
import { distance, nearestOnPath, pathLength, toUnits } from '@/minigames/geometry'
import { RUB_RADIUS } from '@/minigames/Rub'
import { AREAS } from './areas'
import { SERVICES } from './emergency'
import { LEVEL_OUTLINE, LEVELS } from './levels'

/**
 * Content rules every level must meet. These run over every level file, so a new
 * level is checked as soon as it is added to src/content/levels.
 */

const levels = Object.values(LEVELS).filter((l): l is LevelDef => l !== undefined)
const OUTCOMES = ['success', 'partial-success', 'recoverable-mistake', 'unsafe-failure', 'timeout']

const ART = Object.keys(import.meta.glob('../assets/art/*.webp')).map((path) =>
  path.replace(/^.*\/(.+)\.webp$/, '$1'),
)

const inScene = (p: { x: number; y: number }) => p.x >= 6 && p.x <= 94 && p.y >= 8 && p.y <= 92
const unique = (ids: string[]) => new Set(ids).size === ids.length

/** Markers on a scene must not sit on top of each other. */
function apart(points: { x: number; y: number }[]): boolean {
  return points.every((a, i) =>
    points.slice(i + 1).every((b) => Math.abs(a.x - b.x) >= 9 || Math.abs(a.y - b.y) >= 11),
  )
}

const words = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean),
  )

/** Share of words two answers have in common (0 = none, 1 = the same words). */
function overlap(a: string, b: string): number {
  const [x, y] = [words(a), words(b)]
  const shared = [...x].filter((w) => y.has(w)).length
  return shared / (x.size + y.size - shared)
}

/** The most alike pair among some answers, so a failure names the culprits. */
function mostAlike(texts: string[]): { share: number; pair: string } {
  let best = { share: 0, pair: '' }
  texts.forEach((a, i) =>
    texts.slice(i + 1).forEach((b) => {
      const share = overlap(a, b)
      if (share > best.share) best = { share, pair: `"${a}" / "${b}"` }
    }),
  )
  return best
}

/** Two answers sharing more than this share of their words read as near-duplicates. */
const MAX_OVERLAP = 0.5

function checkMinigame(config: SingleMinigameConfig) {
  expect(config.instruction.trim()).not.toBe('')
  switch (config.type) {
    case 'tap-targets':
      expect(config.targets.length).toBeGreaterThanOrEqual(2)
      // At least one thing that must not be done, each with its reason.
      expect(config.decoys.length).toBeGreaterThanOrEqual(1)
      expect(config.decoys.every((d) => d.note.trim() !== '')).toBe(true)
      expect(unique([...config.targets, ...config.decoys].map((t) => t.id))).toBe(true)
      expect([...config.targets, ...config.decoys].every(inScene)).toBe(true)
      expect(apart([...config.targets, ...config.decoys])).toBe(true)
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
      expect(ART, 'picture of the held thing').toContain(config.tool.art)
      expect(inScene(config.tool)).toBe(true)
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
        expect(ART, `picture of ${item.id}`).toContain(item.art)
      }
      expect(apart(config.zones)).toBe(true)
      // Every zone is used, so no zone is a dead end.
      for (const id of zoneIds) expect(config.items.some((i) => i.zoneId === id)).toBe(true)
      break
    }
    case 'quick-decision':
      expect(config.cards.length).toBeGreaterThanOrEqual(4)
      expect(config.secPerCard).toBeGreaterThanOrEqual(10)
      expect(config.secPerCard).toBeLessThanOrEqual(15)
      expect(new Set(config.cards.map((c) => c.answer)).size).toBe(2)
      expect(config.cards.every((c) => c.why.trim() !== '')).toBe(true)
      break
    case 'trace': {
      expect(config.path.length).toBeGreaterThanOrEqual(2)
      expect(config.path.every(inScene)).toBe(true)
      // Long enough to be a gesture, and it starts where the tool can be grabbed.
      expect(pathLength(config.path.map(toUnits))).toBeGreaterThanOrEqual(20)
      expect(ART, 'picture of the tool').toContain(config.tool.art)
      if (config.art) expect(ART, 'close-up picture').toContain(config.art)
      if (config.tool.size !== undefined) {
        expect(config.tool.size).toBeGreaterThanOrEqual(8)
        expect(config.tool.size).toBeLessThanOrEqual(24)
      }
      if (config.speck) {
        // The thing to take away lies on the path, where the tool will pass.
        const { distance } = nearestOnPath(config.path.map(toUnits), toUnits(config.speck))
        expect(distance).toBeLessThanOrEqual(3)
      }
      for (const text of [config.slipNote, config.doneNote, config.realityNote]) {
        expect(text.trim()).not.toBe('')
      }
      break
    }
    case 'rub':
      expect(config.spots.length).toBeGreaterThanOrEqual(1)
      expect(unique(config.spots.map((spot) => spot.id))).toBe(true)
      expect(config.spots.every(inScene)).toBe(true)
      // Two places must not be rubbed by one stroke.
      config.spots.forEach((a, i) =>
        config.spots
          .slice(i + 1)
          .forEach((b) =>
            expect(distance(toUnits(a), toUnits(b))).toBeGreaterThanOrEqual(2 * RUB_RADIUS),
          ),
      )
      expect(ART, 'picture of the tool').toContain(config.tool.art)
      if (config.art) expect(ART, 'close-up picture').toContain(config.art)
      expect(config.doneNote.trim()).not.toBe('')
      expect(config.realityNote.trim()).not.toBe('')
      break
    case 'rotate':
      expect([1, 2, 3]).toContain(config.turns)
      expect(inScene(config)).toBe(true)
      expect(ART, 'picture of the dial').toContain(config.dial.art)
      for (const text of [config.wrongWayNote, config.doneNote, config.realityNote]) {
        expect(text.trim()).not.toBe('')
      }
      break
    case 'call': {
      expect(Object.keys(SERVICES)).toContain(config.number)
      // The player has to know the number: the instruction names the service only.
      expect(config.instruction).not.toContain(config.number)
      expect(config.turns.length).toBeGreaterThanOrEqual(3)
      expect(config.turns.length).toBeLessThanOrEqual(5)
      expect(unique(config.turns.map((t) => t.id))).toBe(true)
      for (const turn of config.turns) {
        expect(turn.ask.trim()).not.toBe('')
        expect(turn.replies).toHaveLength(3)
        expect(turn.replies.filter((r) => r.right)).toHaveLength(1)
        expect(unique(turn.replies.map((r) => r.id))).toBe(true)
        expect(turn.replies.every((r) => r.text.trim() !== '' && r.why.trim() !== '')).toBe(true)
      }
      // The good reply must not sit in the same place every time.
      const places = config.turns.map((t) => t.replies.findIndex((r) => r.right))
      expect(new Set(places).size).toBeGreaterThanOrEqual(2)
      expect(config.closing.trim()).not.toBe('')
      break
    }
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
    { type: 'confirm-order', order: level.choose.order },
    { type: 'start-act' },
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
  it('has a readable intro and clues, at least two of them essential', () => {
    expect(level.intro.length).toBeGreaterThanOrEqual(3)
    expect(level.intro.length).toBeLessThanOrEqual(6)
    expect(level.observe.clues.filter((c) => c.essential).length).toBeGreaterThanOrEqual(2)
    expect(unique(level.observe.clues.map((c) => c.id))).toBe(true)
    expect(level.observe.clues.every(inScene)).toBe(true)
    expect(apart(level.observe.clues)).toBe(true)
  })

  it('has exactly one right assessment among 3–4 options', () => {
    expect(level.assess.options.length).toBeGreaterThanOrEqual(3)
    expect(level.assess.options.length).toBeLessThanOrEqual(4)
    expect(level.assess.options.filter((o) => o.correct)).toHaveLength(1)
    expect(unique(level.assess.options.map((o) => o.id))).toBe(true)
    // Assessments share a frame ("Nghi ngờ … bị …"), so only exact repeats are checked here.
    expect(unique(level.assess.options.map((o) => o.text))).toBe(true)
  })

  it('offers right, unsafe and irrelevant solutions, none of them near-duplicates', () => {
    const { options, order } = level.choose
    expect(unique(options.map((o) => o.id))).toBe(true)
    expect(options.length).toBeGreaterThanOrEqual(6)
    expect(options.length).toBeLessThanOrEqual(8)
    for (const kind of ['correct', 'unsafe', 'irrelevant']) {
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
    }
    // No answer may read like a twin of another: that only confuses.
    const alike = mostAlike(options.map((o) => o.text))
    expect(alike.share, `too alike: ${alike.pair}`).toBeLessThanOrEqual(MAX_OVERLAP)
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
    const quick = perfectRun(level, CHOOSE_TIME_SEC * 0.3)
    expect(quick.outcome).toBe('success')
    expect(quick.stars).toBe(3)
    const slow = perfectRun(level, CHOOSE_TIME_SEC * 0.95)
    expect(slow.passed).toBe(true)
  })
})
