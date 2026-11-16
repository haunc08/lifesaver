import { useRef, useState } from 'react'
import type { ActResult } from '@/game/levelMachine'
import type { SequenceConfig, SingleMinigameConfig } from '@/game/types'
import { DragPlace } from './DragPlace'
import { Hold } from './Hold'
import { QuickDecision } from './QuickDecision'
import { Scan } from './Scan'
import { TapTargets } from './TapTargets'
import type { MinigameProps } from './types'

/** Renders the mini-game a level asks for. Add a case per new mechanic. */
export function Minigame(props: MinigameProps) {
  if (props.config.type === 'sequence') return <Sequence {...props} config={props.config} />
  return <Single {...props} config={props.config} />
}

function Single(props: MinigameProps<SingleMinigameConfig>) {
  const { config } = props
  switch (config.type) {
    case 'tap-targets':
      return <TapTargets {...props} config={config} />
    case 'scan':
      return <Scan {...props} config={config} />
    case 'hold':
      return <Hold {...props} config={config} />
    case 'drag-place':
      return <DragPlace {...props} config={config} />
    case 'quick-decision':
      return <QuickDecision {...props} config={config} />
  }
}

/** Plays several mechanics in a row; the result is their average, and one failure ends it. */
function Sequence({ config, onDone, onStep, ...rest }: MinigameProps<SequenceConfig>) {
  const [index, setIndex] = useState(0)
  const scores = useRef<number[]>([])

  const stepDone = (result: ActResult) => {
    scores.current.push(result.accuracy)
    const accuracy = scores.current.reduce((a, b) => a + b, 0) / config.steps.length
    if (!result.completed) return onDone({ completed: false, accuracy })
    if (index === config.steps.length - 1) return onDone({ completed: true, accuracy })
    setIndex(index + 1)
    onStep?.()
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className="text-center text-sm font-bold text-blue-ink">
        Bước {index + 1}/{config.steps.length}
      </p>
      <div className="flex flex-1 flex-col">
        <Single key={index} {...rest} config={config.steps[index]} onDone={stepDone} />
      </div>
    </div>
  )
}
