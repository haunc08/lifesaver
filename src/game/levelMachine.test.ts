import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/content/levels'
import level from '@/content/levels/school-01-fainting'
import {
  ASSESS_TIME_SEC,
  CALL_DIAL_SEC,
  CALL_TURN_SEC,
  CHOOSE_TIME_SEC,
  initialState,
  MINIGAME_TIME_SEC,
  minigameTimeSec,
  step,
  summarize,
  type LevelEvent,
  type LevelState,
} from './levelMachine'
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
      { type: 'start-act' },
      finishAct,
    ])
    expect(end).toMatchObject({ phase: 'outcome', endReason: 'completed' })
    expect(score(summarize(level, end))).toMatchObject({ total: 100, stars: 3, outcome: 'success' })
  })

  it('leaves the observe phase only when every essential clue has been seen', () => {
    // Two essential clues and the optional one are not enough: it is not a matter of counting.
    const some = play([
      { type: 'intro-done' },
      { type: 'clue-found', id: 'face' },
      { type: 'clue-found', id: 'chest' },
      { type: 'clue-found', id: 'room' },
      { type: 'observe-done' },
    ])
    expect(some.phase).toBe('observe')

    // The essential ones alone are enough; the optional clue can be left.
    expect(play(toAssess).phase).toBe('assess')
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

  it('ends the choosing round by itself once every right step is picked, with no undo', () => {
    const partway = play([...toChoose, ...pick('safe', 'check', 'call')])
    expect(partway).toMatchObject({ phase: 'choose', solutionConfirmed: false })
    // Nothing can start the action before the plan is complete.
    expect(step(level, partway, { type: 'start-act' })).toEqual(partway)

    const complete = step(level, partway, { type: 'pick', id: 'lay' })
    expect(complete).toMatchObject({ phase: 'choose', solutionConfirmed: true, feedback: null })
    // Further picks are ignored, and the action starts on request.
    expect(step(level, complete, { type: 'pick', id: 'video' })).toEqual(complete)
    expect(step(level, complete, { type: 'start-act' }).phase).toBe('act')
  })

  it('notices steps done in the wrong order and still lets the run pass', () => {
    const s = play([...toChoose, ...pick('lay', 'safe', 'check', 'call')])
    // No alert at this point; the result screen explains the order.
    expect(s.feedback).toBeNull()
    const end = play([{ type: 'start-act' }, finishAct], s)
    const summary = summarize(level, end)
    expect(summary.orderCorrect).toBe(false)
    expect(score(summary)).toMatchObject({ outcome: 'partial-success', passed: true })
  })

  it('lowers the solution score for an irrelevant pick', () => {
    const s = play([...toChoose, ...pick('video', 'safe', 'check', 'call', 'lay')])
    expect(s.rejected).toEqual(['video'])
    expect(summarize(level, s).solutionQuality).toBeCloseTo(0.8)
  })

  it('runs the clock only in timed phases and only when not paused', () => {
    const tick: LevelEvent = { type: 'tick', ms: 1000 }
    expect(play([tick]).elapsedMs).toBe(0)
    expect(play([...toAssess, tick]).elapsedMs).toBe(1000)
    expect(play([...toAssess, { type: 'pause' }, tick]).elapsedMs).toBe(0)
    expect(play([...toAssess, { type: 'pause' }, { type: 'resume' }, tick]).elapsedMs).toBe(1000)
  })

  it('gives every round its own clock, which starts afresh', () => {
    const nearlyOut: LevelEvent = { type: 'tick', ms: (ASSESS_TIME_SEC - 1) * 1000 }
    const inChoose = play([...toAssess, nearlyOut, { type: 'assess-answer', id: 'faint' }])
    // Almost all of the assess round was used, yet the choose round starts from zero.
    expect(inChoose).toMatchObject({ phase: 'choose', roundMs: 0 })
    expect(inChoose.roundLimitMs).toBe(CHOOSE_TIME_SEC * 1000)

    const inAct = play([...pick('safe', 'check', 'call', 'lay'), { type: 'start-act' }], inChoose)
    expect(inAct).toMatchObject({ phase: 'act', roundMs: 0 })
    expect(inAct.roundLimitMs).toBe(MINIGAME_TIME_SEC * 1000)
    // The time score compares all time used with the sum of the rounds' limits.
    expect(summarize(level, inAct).timeLimitMs).toBe(
      (ASSESS_TIME_SEC + CHOOSE_TIME_SEC + MINIGAME_TIME_SEC) * 1000,
    )
  })

  it('stops the clock while a completed plan is on show', () => {
    const complete = play([...toChoose, ...pick('safe', 'check', 'call', 'lay')])
    expect(step(level, complete, { type: 'tick', ms: 5000 }).elapsedMs).toBe(complete.elapsedMs)
  })

  it('times out when the clock of the current round runs down', () => {
    const s = play([...toAssess, { type: 'tick', ms: ASSESS_TIME_SEC * 1000 }])
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

describe('time allowed for a mini-game', () => {
  const gasLeak = LEVELS['dormitory-02']!
  const steps = gasLeak.act.type === 'sequence' ? gasLeak.act.steps : []

  it('gives a phone call time to dial plus time for each question', () => {
    const call = steps.find((s) => s.type === 'call')!
    expect(call.type === 'call' && call.turns.length).toBe(4)
    expect(minigameTimeSec(call)).toBe(CALL_DIAL_SEC + 4 * CALL_TURN_SEC)
  })

  it('gives every gesture mini-game the standard time', () => {
    expect(minigameTimeSec(steps.find((s) => s.type === 'rotate')!)).toBe(MINIGAME_TIME_SEC)
    expect(minigameTimeSec(steps.find((s) => s.type === 'scan')!)).toBe(MINIGAME_TIME_SEC)
  })

  it('starts each step of a chain with its own clock', () => {
    const toAct: LevelEvent[] = [
      { type: 'intro-done' },
      ...gasLeak.observe.clues.map((c): LevelEvent => ({ type: 'clue-found', id: c.id })),
      { type: 'observe-done' },
      { type: 'assess-answer', id: gasLeak.assess.options.find((o) => o.correct)!.id },
      ...gasLeak.choose.order.map((id): LevelEvent => ({ type: 'pick', id })),
      { type: 'start-act' },
    ]
    let state = toAct.reduce((s, e) => step(gasLeak, s, e), initialState())
    expect(state.roundLimitMs).toBe(MINIGAME_TIME_SEC * 1000)
    state = step(gasLeak, state, { type: 'act-step' })
    state = step(gasLeak, state, { type: 'act-step' })
    expect(state.actStep).toBe(2)
    expect(state.roundLimitMs).toBe((CALL_DIAL_SEC + 4 * CALL_TURN_SEC) * 1000)
    expect(state.roundMs).toBe(0)
  })
})
