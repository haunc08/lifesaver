import type { Outcome } from './types'

/** What happened in one playthrough, reduced to the facts scoring needs. */
export interface RunSummary {
  assessment: 'first-try' | 'second-try' | 'failed'
  /** Whether the player got as far as confirming a solution. */
  solutionConfirmed: boolean
  /** 0..1: share of the required steps chosen (a partial option counts half). */
  solutionQuality: number
  orderCorrect: boolean
  mandatoryDone: boolean
  unsafeAttempts: number
  criticalSafetyMistake: boolean
  actionCompleted: boolean
  /** 0..1, reported by the mini-game. */
  actionAccuracy: number
  timeUsedMs: number
  timeLimitMs: number
  timedOut: boolean
}

export interface ScoreBreakdown {
  action: number
  solution: number
  assessment: number
  safety: number
  time: number
}

export interface ScoreResult {
  breakdown: ScoreBreakdown
  total: number
  stars: 0 | 1 | 2 | 3
  outcome: Outcome
  passed: boolean
}

export const MAX_POINTS: ScoreBreakdown = {
  action: 30,
  solution: 25,
  assessment: 20,
  safety: 15,
  time: 10,
}

export const STAR_THRESHOLDS = [60, 75, 90] as const

const UNSAFE_PENALTY = 8
const ORDER_PENALTY = 5
/** Using up to this share of the clock still earns full time points. */
const FULL_TIME_SHARE = 0.5

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function timePoints(s: RunSummary): number {
  if (!s.actionCompleted || s.timeLimitMs <= 0) return 0
  const used = clamp01(s.timeUsedMs / s.timeLimitMs)
  const share = used <= FULL_TIME_SHARE ? 1 : (1 - used) / (1 - FULL_TIME_SHARE)
  return Math.round(MAX_POINTS.time * share)
}

function outcomeOf(s: RunSummary): Outcome {
  if (s.timedOut) return 'timeout'
  if (s.criticalSafetyMistake) return 'unsafe-failure'
  if (s.assessment === 'failed' || !s.mandatoryDone || !s.actionCompleted) {
    return 'recoverable-mistake'
  }
  const clean = s.solutionQuality >= 1 && s.orderCorrect && s.unsafeAttempts === 0
  return clean ? 'success' : 'partial-success'
}

export function starsFor(total: number): 0 | 1 | 2 | 3 {
  if (total >= STAR_THRESHOLDS[2]) return 3
  if (total >= STAR_THRESHOLDS[1]) return 2
  if (total >= STAR_THRESHOLDS[0]) return 1
  return 0
}

export function score(s: RunSummary): ScoreResult {
  const assessment =
    s.assessment === 'first-try'
      ? MAX_POINTS.assessment
      : s.assessment === 'second-try'
        ? MAX_POINTS.assessment / 2
        : 0

  const solution = s.solutionConfirmed
    ? Math.round(MAX_POINTS.solution * clamp01(s.solutionQuality))
    : 0

  const safety = s.solutionConfirmed
    ? Math.max(
        0,
        MAX_POINTS.safety -
          UNSAFE_PENALTY * s.unsafeAttempts -
          (s.orderCorrect ? 0 : ORDER_PENALTY),
      )
    : 0

  const action = Math.round(MAX_POINTS.action * clamp01(s.actionAccuracy))

  const breakdown: ScoreBreakdown = { action, solution, assessment, safety, time: timePoints(s) }
  const total =
    breakdown.action + breakdown.solution + breakdown.assessment + breakdown.safety + breakdown.time

  const outcome = outcomeOf(s)
  // A high total never makes up for a failed objective or a safety mistake.
  const passed = outcome === 'success' || outcome === 'partial-success'

  return { breakdown, total, stars: passed ? starsFor(total) : 0, outcome, passed }
}
