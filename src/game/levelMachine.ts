import type { RunSummary } from './scoring'
import type { LevelDef, PhaseId, SingleMinigameConfig, SolutionOption } from './types'

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

/**
 * Every timed round has its own clock, which starts afresh when the round
 * begins. A round is the assess phase, the choose phase, or one mini-game.
 * These are gameplay limits, set generously, not real medical times.
 */
export const ASSESS_TIME_SEC = 60
export const CHOOSE_TIME_SEC = 120
export const MINIGAME_TIME_SEC = 90
/** Quick-decision cards carry their own timers; this is added per card for reading the explanation. */
export const CARD_READING_SEC = 12

/** A phone call: time to dial, plus this much to read and answer each question. */
export const CALL_DIAL_SEC = 30
export const CALL_TURN_SEC = 25

/** Seconds allowed for one mini-game. */
export function minigameTimeSec(config: SingleMinigameConfig): number {
  if (config.type === 'quick-decision') {
    return config.cards.length * (config.secPerCard + CARD_READING_SEC)
  }
  if (config.type === 'call') return CALL_DIAL_SEC + config.turns.length * CALL_TURN_SEC
  return MINIGAME_TIME_SEC
}

function actSteps(level: LevelDef): SingleMinigameConfig[] {
  return level.act.type === 'sequence' ? level.act.steps : [level.act]
}

export type EndReason = 'completed' | 'assess-failed' | 'act-failed' | 'unsafe' | 'timeout'

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
  /** Time spent in all timed rounds so far. */
  elapsedMs: number
  /** Time spent in the current round; back to zero when a new round starts. */
  roundMs: number
  /** Limit of the current round, or 0 outside timed phases. */
  roundLimitMs: number
  /** Sum of the limits of every round begun, for the time score. */
  allowedMs: number
  /** Which mini-game of the act phase is being played (0 unless the level chains several). */
  actStep: number
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
  /** The plan is complete and has been shown for a moment: move on to the action. */
  | { type: 'start-act' }
  /** A chained level moves on to its next mini-game, which gets a fresh clock. */
  | { type: 'act-step' }
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
    roundMs: 0,
    roundLimitMs: 0,
    allowedMs: 0,
    actStep: 0,
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

/** Whether the clock counts in this phase at all; it stays hidden in the others. */
export function isTimedPhase(phase: PhaseId): boolean {
  return TIMED_PHASES.includes(phase)
}

export function isClockRunning(state: LevelState): boolean {
  // The clock also stops once the plan is complete, while it is shown before the action.
  const waiting = state.phase === 'choose' && state.solutionConfirmed
  return !state.paused && isTimedPhase(state.phase) && !waiting
}

/** Start a new timed round: a fresh clock with the given limit. */
function startRound(state: LevelState, limitSec: number): LevelState {
  const roundLimitMs = limitSec * 1000
  return { ...state, roundMs: 0, roundLimitMs, allowedMs: state.allowedMs + roundLimitMs }
}

/** Every essential clue has been inspected. */
export function observeComplete(level: LevelDef, cluesFound: string[]): boolean {
  return level.observe.clues.every((c) => !c.essential || cluesFound.includes(c.id))
}

/** Whether the picked steps follow the order the level asks for. */
function inOrder(level: LevelDef, picks: string[]): boolean {
  const positions = picks.map((id) => level.choose.order.indexOf(id)).filter((i) => i >= 0)
  return positions.every((p, i) => i === 0 || p >= positions[i - 1])
}

function option(level: LevelDef, id: string): SolutionOption | undefined {
  return level.choose.options.find((o) => o.id === id)
}

function countKind(level: LevelDef, ids: string[], kind: SolutionOption['kind']): number {
  return ids.filter((id) => option(level, id)?.kind === kind).length
}

function mandatoryDone(level: LevelDef, picks: string[]): boolean {
  return level.choose.options.filter((o) => o.mandatory).every((o) => picks.includes(o.id))
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
      const ms = Math.min(event.ms, state.roundLimitMs - state.roundMs)
      const ticked = {
        ...state,
        elapsedMs: state.elapsedMs + ms,
        roundMs: state.roundMs + ms,
      }
      return ticked.roundMs >= state.roundLimitMs ? end(ticked, 'timeout') : ticked
    }

    case 'intro-done':
      return state.phase === 'intro' ? { ...state, phase: 'observe' } : state

    case 'clue-found': {
      if (state.phase !== 'observe' || state.cluesFound.includes(event.id)) return state
      if (!level.observe.clues.some((c) => c.id === event.id)) return state
      return { ...state, cluesFound: [...state.cluesFound, event.id] }
    }

    case 'observe-done': {
      if (state.phase !== 'observe' || !observeComplete(level, state.cluesFound)) return state
      return startRound({ ...state, phase: 'assess', feedback: null }, ASSESS_TIME_SEC)
    }

    case 'assess-answer': {
      if (state.phase !== 'assess' || state.assessWrong.includes(event.id)) return state
      const answer = level.assess.options.find((o) => o.id === event.id)
      if (!answer) return state
      if (answer.correct) {
        return startRound(
          {
            ...state,
            phase: 'choose',
            assessSolved: true,
            feedback: { tone: 'good', text: answer.feedback },
          },
          CHOOSE_TIME_SEC,
        )
      }
      const assessWrong = [...state.assessWrong, answer.id]
      const feedback: Feedback = { tone: 'bad', text: answer.feedback }
      if (assessWrong.length >= MAX_ASSESS_ATTEMPTS) {
        return end({ ...state, assessWrong }, 'assess-failed', feedback)
      }
      return { ...state, assessWrong, feedback }
    }

    case 'pick': {
      // A pick is final: there is no undo, and the round ends by itself.
      if (state.phase !== 'choose' || state.solutionConfirmed) return state
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
      const picks = [...state.picks, o.id]
      // The plan is complete once every right step is in it; nothing needs confirming.
      if (!level.choose.order.every((id) => picks.includes(id))) {
        return { ...state, picks, feedback: null }
      }
      // No message here, right order or not: the action starts at once, so it would
      // not be read. The result screen lists the right order.
      return { ...state, picks, solutionConfirmed: true, feedback: null }
    }

    case 'start-act': {
      if (state.phase !== 'choose' || !state.solutionConfirmed) return state
      return startRound(
        { ...state, phase: 'act', feedback: null },
        minigameTimeSec(actSteps(level)[0]),
      )
    }

    case 'act-step': {
      const next = actSteps(level)[state.actStep + 1]
      if (state.phase !== 'act' || !next) return state
      return startRound({ ...state, actStep: state.actStep + 1 }, minigameTimeSec(next))
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
  const chosen = order.filter((id) => state.picks.includes(id)).length
  const irrelevant = countKind(level, state.rejected, 'irrelevant')
  const solutionQuality =
    order.length === 0 ? 0 : Math.max(0, chosen / order.length - 0.2 * irrelevant)

  return {
    assessment: !state.assessSolved
      ? 'failed'
      : state.assessWrong.length === 0
        ? 'first-try'
        : 'second-try',
    solutionConfirmed: state.solutionConfirmed,
    solutionQuality,
    orderCorrect: inOrder(level, state.picks),
    mandatoryDone: mandatoryDone(level, state.picks),
    unsafeAttempts: countKind(level, state.rejected, 'unsafe'),
    criticalSafetyMistake: state.endReason === 'unsafe',
    actionCompleted: state.act?.completed ?? false,
    actionAccuracy: state.act?.accuracy ?? 0,
    timeUsedMs: state.elapsedMs,
    timeLimitMs: state.allowedMs,
    timedOut: state.endReason === 'timeout',
  }
}
