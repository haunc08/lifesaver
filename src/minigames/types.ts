import type { ActResult } from '@/game/levelMachine'
import type { MinigameConfig } from '@/game/types'

/** Contract every mini-game component fulfils. */
export interface MinigameProps<C extends MinigameConfig = MinigameConfig> {
  config: C
  /** Scene label for the placeholder backdrop. */
  scene: string
  /** Call exactly once, when the player finishes or fails the mini-game. */
  onDone: (result: ActResult) => void
}
