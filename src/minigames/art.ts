import type { SingleMinigameConfig } from '@/game/types'

/** Art ids of the pictures a mini-game shows besides the level's scene, for preloading. */
export function minigameArt(config: SingleMinigameConfig): string[] {
  switch (config.type) {
    case 'hold':
      return [config.tool.art]
    case 'drag-place':
      return config.items.map((item) => item.art)
    case 'trace':
    case 'rub':
      return [config.tool.art, ...(config.art ? [config.art] : [])]
    case 'rotate':
      return [config.dial.art]
    case 'call':
      return ['operator']
    default:
      return []
  }
}
