import { describe, expect, it } from 'vitest'
import { MAX_POINTS, score, starsFor, type RunSummary } from './scoring'

const perfect: RunSummary = {
  assessment: 'first-try',
  solutionConfirmed: true,
  solutionQuality: 1,
  orderCorrect: true,
  mandatoryDone: true,
  unsafeAttempts: 0,
  criticalSafetyMistake: false,
  actionCompleted: true,
  actionAccuracy: 1,
  timeUsedMs: 30_000,
  timeLimitMs: 90_000,
  timedOut: false,
}

describe('score', () => {
  it('gives 100 points and 3 stars for a perfect run', () => {
    const r = score(perfect)
    expect(r.breakdown).toEqual(MAX_POINTS)
    expect(r.total).toBe(100)
    expect(r).toMatchObject({ stars: 3, outcome: 'success', passed: true })
  })

  it('halves the assessment points on the second try', () => {
    const r = score({ ...perfect, assessment: 'second-try' })
    expect(r.breakdown.assessment).toBe(10)
    expect(r.outcome).toBe('success')
  })

  it('charges for unsafe attempts and wrong order, and calls the run a partial success', () => {
    const r = score({ ...perfect, unsafeAttempts: 1, orderCorrect: false })
    expect(r.breakdown.safety).toBe(2)
    expect(r).toMatchObject({ outcome: 'partial-success', passed: true })
  })

  it('never passes a critical safety mistake, whatever the total', () => {
    const r = score({ ...perfect, unsafeAttempts: 2, criticalSafetyMistake: true })
    expect(r).toMatchObject({ outcome: 'unsafe-failure', passed: false, stars: 0 })
  })

  it('never passes a run that skipped a mandatory step', () => {
    const r = score({ ...perfect, mandatoryDone: false })
    expect(r).toMatchObject({ outcome: 'recoverable-mistake', passed: false, stars: 0 })
  })

  it('fails a run whose assessment was wrong twice and scores only what was done', () => {
    const r = score({
      ...perfect,
      assessment: 'failed',
      solutionConfirmed: false,
      solutionQuality: 0,
      actionCompleted: false,
      actionAccuracy: 0,
    })
    expect(r.total).toBe(0)
    expect(r).toMatchObject({ outcome: 'recoverable-mistake', passed: false })
  })

  it('reports a time-out ahead of every other end state', () => {
    const r = score({ ...perfect, timedOut: true, criticalSafetyMistake: true })
    expect(r).toMatchObject({ outcome: 'timeout', passed: false })
  })

  it('pays full time points up to half the clock, then scales down to zero', () => {
    expect(score({ ...perfect, timeUsedMs: 45_000 }).breakdown.time).toBe(10)
    expect(score({ ...perfect, timeUsedMs: 67_500 }).breakdown.time).toBe(5)
    expect(score({ ...perfect, timeUsedMs: 90_000 }).breakdown.time).toBe(0)
  })
})

describe('starsFor', () => {
  it('awards stars at 60, 75 and 90 points', () => {
    expect([59, 60, 74, 75, 89, 90].map(starsFor)).toEqual([0, 1, 1, 2, 2, 3])
  })
})
