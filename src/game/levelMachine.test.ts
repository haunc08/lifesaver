import { describe, expect, it } from 'vitest'
import level from '@/content/levels/school-01-fainting'
import { initialState, step, summarize, type LevelEvent, type LevelState } from './levelMachine'
import { score } from './scoring'

const play = (events: LevelEvent[], from: LevelState = initialState()) =>
  events.reduce((s, e) => step(level, s, e), from)

const toAssess: LevelEvent[] = [
  { type: 'intro-done' },
  { type: 'clue-found', id: 'face' },
  { type: 'clue-found', id: 'chest' },
  { type: 'clue-found', id: 'limbs' },
  { type: 'observe-done' },
]
const toChoose: LevelEvent[] = [...toAssess, { type: 'assess-answer', id: 'faint' }]
const pick = (...ids: string[]): LevelEvent[] => ids.map((id) => ({ type: 'pick', id }))
const finishAct: LevelEvent = { type: 'act-done', result: { completed: true, accuracy: 1 } }

describe('level machine', () => {
  it('walks a perfect run through all six phases to a 3-star success', () => {
    const end = play([
      ...toChoose,
      ...pick('safe', 'check', 'call', 'lay'),
      { type: 'confirm-solution' },
      finishAct,
    ])
    expect(end).toMatchObject({ phase: 'outcome', endReason: 'completed' })
    expect(score(summarize(level, end))).toMatchObject({ total: 100, stars: 3, outcome: 'success' })
  })

  it('does not leave the observe phase before enough clues are found', () => {
    const s = play([
      { type: 'intro-done' },
      { type: 'clue-found', id: 'face' },
      { type: 'observe-done' },
    ])
    expect(s.phase).toBe('observe')
  })

  it('allows a second assessment attempt, then fails the branch', () => {
    const once = play([...toAssess, { type: 'assess-answer', id: 'seizure' }])
    expect(once).toMatchObject({ phase: 'assess', assessWrong: ['seizure'] })
    expect(once.feedback?.tone).toBe('bad')

    const twice = step(level, once, { type: 'assess-answer', id: 'sleep' })
    expect(twice).toMatchObject({ phase: 'outcome', endReason: 'assess-failed' })
    expect(score(summarize(level, twice)).outcome).toBe('recoverable-mistake')
  })

  it('blocks an unsafe option with feedback and never adds it to the plan', () => {
    const s = play([...toChoose, ...pick('sugar')])
    expect(s).toMatchObject({ phase: 'choose', picks: [], rejected: ['sugar'] })
    expect(s.feedback?.tone).toBe('bad')
  })

  it('ends the level as an unsafe failure on the second unsafe choice', () => {
    const s = play([...toChoose, ...pick('sugar', 'shake')])
    expect(s).toMatchObject({ phase: 'outcome', endReason: 'unsafe' })
    expect(score(summarize(level, s))).toMatchObject({ outcome: 'unsafe-failure', passed: false })
  })

  it('skips the action and fails when a mandatory step is missing', () => {
    const s = play([...toChoose, ...pick('safe', 'lay'), { type: 'confirm-solution' }])
    expect(s).toMatchObject({ phase: 'outcome', endReason: 'missing-mandatory' })
    expect(score(summarize(level, s)).passed).toBe(false)
  })

  it('gives half credit for a partial option and marks the run a partial success', () => {
    const s = play([
      ...toChoose,
      ...pick('safe', 'check', 'call', 'lay-flat'),
      { type: 'confirm-solution' },
      finishAct,
    ])
    const summary = summarize(level, s)
    expect(summary.solutionQuality).toBeCloseTo(0.875)
    expect(score(summary)).toMatchObject({ outcome: 'partial-success', passed: true })
  })

  it('notices steps done in the wrong order', () => {
    const s = play([
      ...toChoose,
      ...pick('lay', 'safe', 'check', 'call'),
      { type: 'confirm-solution' },
    ])
    expect(summarize(level, s).orderCorrect).toBe(false)
  })

  it('undoes the last pick', () => {
    const s = play([...toChoose, ...pick('safe', 'lay'), { type: 'undo-pick' }])
    expect(s.picks).toEqual(['safe'])
  })

  it('runs the clock only in timed phases and only when not paused', () => {
    const tick: LevelEvent = { type: 'tick', ms: 1000 }
    expect(play([tick]).elapsedMs).toBe(0)
    expect(play([...toAssess, tick]).elapsedMs).toBe(1000)
    expect(play([...toAssess, { type: 'pause' }, tick]).elapsedMs).toBe(0)
    expect(play([...toAssess, { type: 'pause' }, { type: 'resume' }, tick]).elapsedMs).toBe(1000)
  })

  it('times out when the clock runs down', () => {
    const s = play([...toAssess, { type: 'tick', ms: level.timeLimitSec * 1000 }])
    expect(s).toMatchObject({ phase: 'outcome', endReason: 'timeout' })
    expect(score(summarize(level, s)).outcome).toBe('timeout')
  })

  it('ignores events that do not belong to the current phase', () => {
    const start = initialState()
    expect(play([{ type: 'assess-answer', id: 'faint' }, ...pick('safe'), finishAct])).toEqual(
      start,
    )
  })
})
