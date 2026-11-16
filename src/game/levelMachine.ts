import type { RunSummary } from './scoring'
import type { LevelDef, PhaseId, SolutionOption } from './types'

/**
 * The level state machine: a pure reducer that walks a playthrough through the
 * six phases. It knows the rules (attempt limits, blocked unsafe options, the
 * clock) and nothing about rendering.
 */

export const MAX_ASSESS_ATTEMPTS = 2
/** This many unsafe choices in one run is a critical safety mistake. */
export const MAX_UNSAFE_ATTEMPTS = 2
/** The clock only runs in these phases; intro and observe give time to read. */
const TIMED_PHASES: readonly PhaseId[] = ['assess', 'choose', 'act']

export type EndReason =
  'completed' | 'assess-failed' | 'missing-mandatory' | 'act-failed' | 'unsafe' | 'timeout'

export interface Feedback {
  tone: 'good' | 'warn' | 'bad'
  text: string
}

export interface ActResult {
  completed: boolean
  /** 0..1 */
  accuracy: number
}

export interface LevelState {
  phase: PhaseId
  paused: boolean
  /** Time spent in timed phases. */
  elapsedMs: number
  cluesFound: string[]
  /** Ids of the wrong assessment answers given so far. */
  assessWrong: string[]
  assessSolved: boolean
  /** Accepted solution options, in the order picked. */
  picks: string[]
  /** Unsafe or irrelevant options the player tried; these are never executed. */
  rejected: string[]
  solutionConfirmed: boolean
  act: ActResult | null
  hintsUsed: number
  feedback: Feedback | null
  endReason: EndReason | null
}

export type LevelEvent =
  | { type: 'intro-done' }
  | { type: 'clue-found'; id: string }
  | { type: 'observe-done' }
  | { type: 'assess-answer'; id: string }
  | { type: 'pick'; id: string }
  | { type: 'undo-pick' }
  | { type: 'confirm-solution' }
  | { type: 'act-done'; result: ActResult }
  | { type: 'tick'; ms: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'hint' }

export function initialState(): LevelState {
  return {
    phase: 'intro',
    paused: false,
    elapsedMs: 0,
    cluesFound: [],
    assessWrong: [],
    assessSolved: false,
    picks: [],
    rejected: [],
    solutionConfirmed: false,
    act: null,
    hintsUsed: 0,
    feedback: null,
    endReason: null,
  }
}

export function isClockRunning(state: LevelState): boolean {
  return !state.paused && TIMED_PHASES.includes(state.phase)
}

function option(level: LevelDef, id: string): SolutionOption | undefined {
  return level.choose.options.find((o) => o.id === id)
}

function countKind(level: LevelDef, ids: string[], kind: SolutionOption['kind']): number {
  return ids.filter((id) => option(level, id)?.kind === kind).length
}

/** The required step a pick stands for: itself, or the step a partial option replaces. */
function stepOf(level: LevelDef, pickId: string): string | undefined {
  const o = option(level, pickId)
  if (!o) return undefined
  return o.kind === 'partial' ? o.substitutes : o.id
}

function mandatoryDone(level: LevelDef, picks: string[]): boolean {
  const covered = new Set(picks.map((id) => stepOf(level, id)))
  return level.choose.options.filter((o) => o.mandatory).every((o) => covered.has(o.id))
}

function end(
  state: LevelState,
  endReason: EndReason,
  feedback: Feedback | null = null,
): LevelState {
  return { ...state, phase: 'outcome', endReason, feedback }
}

export function step(level: LevelDef, state: LevelState, event: LevelEvent): LevelState {
  switch (event.type) {
    case 'pause':
      return state.phase === 'outcome' ? state : { ...state, paused: true }
    case 'resume':
      return { ...state, paused: false }
    case 'hint':
      return { ...state, hintsUsed: state.hintsUsed + 1 }

    case 'tick': {
      if (!isClockRunning(state)) return state
      const elapsedMs = state.elapsedMs + event.ms
      const limit = level.timeLimitSec * 1000
      if (elapsedMs >= limit) return end({ ...state, elapsedMs: limit }, 'timeout')
      return { ...state, elapsedMs }
    }

    case 'intro-done':
      return state.phase === 'intro' ? { ...state, phase: 'observe' } : state

    case 'clue-found': {
      if (state.phase !== 'observe' || state.cluesFound.includes(event.id)) return state
      if (!level.observe.clues.some((c) => c.id === event.id)) return state
      return { ...state, cluesFound: [...state.cluesFound, event.id] }
    }

    case 'observe-done': {
      if (state.phase !== 'observe' || state.cluesFound.length < level.observe.required)
        return state
      return { ...state, phase: 'assess', feedback: null }
    }

    case 'assess-answer': {
      if (state.phase !== 'assess' || state.assessWrong.includes(event.id)) return state
      const answer = level.assess.options.find((o) => o.id === event.id)
      if (!answer) return state
      if (answer.correct) {
        return {
          ...state,
          phase: 'choose',
          assessSolved: true,
          feedback: { tone: 'good', text: answer.feedback },
        }
      }
      const assessWrong = [...state.assessWrong, answer.id]
      const feedback: Feedback = { tone: 'bad', text: answer.feedback }
      if (assessWrong.length >= MAX_ASSESS_ATTEMPTS) {
        return end({ ...state, assessWrong }, 'assess-failed', feedback)
      }
      return { ...state, assessWrong, feedback }
    }

    case 'pick': {
      if (state.phase !== 'choose') return state
      const o = option(level, event.id)
      if (!o || state.picks.includes(o.id) || state.rejected.includes(o.id)) return state
      if (o.kind === 'unsafe') {
        const rejected = [...state.rejected, o.id]
        const feedback: Feedback = { tone: 'bad', text: o.feedback }
        if (countKind(level, rejected, 'unsafe') >= MAX_UNSAFE_ATTEMPTS) {
          return end({ ...state, rejected }, 'unsafe', feedback)
        }
        return { ...state, rejected, feedback }
      }
      if (o.kind === 'irrelevant') {
        return {
          ...state,
          rejected: [...state.rejected, o.id],
          feedback: { tone: 'warn', text: o.feedback },
        }
      }
      return { ...state, picks: [...state.picks, o.id], feedback: null }
    }

    case 'undo-pick': {
      if (state.phase !== 'choose' || state.picks.length === 0) return state
      return { ...state, picks: state.picks.slice(0, -1), feedback: null }
    }

    case 'confirm-solution': {
      if (state.phase !== 'choose' || state.picks.length === 0) return state
      const confirmed = { ...state, solutionConfirmed: true, feedback: null }
      if (!mandatoryDone(level, state.picks)) return end(confirmed, 'missing-mandatory')
      return { ...confirmed, phase: 'act' }
    }

    case 'act-done': {
      if (state.phase !== 'act') return state
      const acted = { ...state, act: event.result }
      return end(acted, event.result.completed ? 'completed' : 'act-failed')
    }
  }
}

/** Reduce a playthrough to the facts scoring needs. */
export function summarize(level: LevelDef, state: LevelState): RunSummary {
  const { order } = level.choose
  const steps = state.picks.map((id) => stepOf(level, id))

  const credit = order.map((stepId) => {
    if (state.picks.includes(stepId)) return 1
    return steps.includes(stepId) ? 0.5 : 0
  })
  const irrelevant = countKind(level, state.rejected, 'irrelevant')
  const solutionQuality =
    order.length === 0
      ? 0
      : Math.max(0, credit.reduce<number>((a, b) => a + b, 0) / order.length - 0.2 * irrelevant)

  const positions = steps
    .map((s) => (s === undefined ? -1 : order.indexOf(s)))
    .filter((i) => i >= 0)
  const orderCorrect = positions.every((p, i) => i === 0 || p >= positions[i - 1])

  return {
    assessment: !state.assessSolved
      ? 'failed'
      : state.assessWrong.length === 0
        ? 'first-try'
        : 'second-try',
    solutionConfirmed: state.solutionConfirmed,
    solutionQuality,
    orderCorrect,
    mandatoryDone: mandatoryDone(level, state.picks),
    unsafeAttempts: countKind(level, state.rejected, 'unsafe'),
    criticalSafetyMistake: state.endReason === 'unsafe',
    actionCompleted: state.act?.completed ?? false,
    actionAccuracy: state.act?.accuracy ?? 0,
    timeUsedMs: state.elapsedMs,
    timeLimitMs: level.timeLimitSec * 1000,
    timedOut: state.endReason === 'timeout',
  }
}
