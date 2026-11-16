import type { MinigameProps } from './types'
import { TapTargets } from './TapTargets'

/** Renders the mini-game a level asks for. Add a case per new mechanic. */
export function Minigame(props: MinigameProps) {
  switch (props.config.type) {
    case 'tap-targets':
      return <TapTargets {...props} config={props.config} />
  }
}
