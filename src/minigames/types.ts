import type { ActResult } from '@/game/levelMachine'
import type { MinigameConfig } from '@/game/types'

/** Contract every mini-game component fulfils. */
export interface MinigameProps<C extends MinigameConfig = MinigameConfig> {
  config: C
  /** Art id of the scene illustration (the level id). */
  artId: string
  /** Name of the place, for the scene's alt text. */
  scene: string
  /** True while the hint or pause panel is open: timers must stand still. */
  paused: boolean
  /** Call exactly once, when the player finishes or fails the mini-game. */
  onDone: (result: ActResult) => void
}

/** Stray taps or slips forgiven before they start to cost accuracy. */
export const FREE_MISSES = 1

/** Share of right actions, with the first few misses forgiven. */
export function accuracyOf(done: number, misses: number): number {
  return done / (done + Math.max(0, misses - FREE_MISSES))
}

/** How long the last piece of feedback stays up before the mini-game hands over. */
export const DONE_DELAY_MS = 900
