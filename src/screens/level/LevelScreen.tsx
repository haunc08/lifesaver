import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { preloadArt } from '@/art'
import { sfx } from '@/audio'
import { LEVELS } from '@/content/levels'
import {
  initialState,
  isClockRunning,
  isTimedPhase,
  step,
  summarize,
  type LevelEvent,
  type LevelState,
} from '@/game/levelMachine'
import type { Reward } from '@/game/progression'
import { score } from '@/game/scoring'
import type { LevelDef } from '@/game/types'
import { useSave } from '@/state/save'
import { useUnlocks } from '@/state/unlocks'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { Hud } from './Hud'
import {
  ActPhase,
  AssessPhase,
  ChoosePhase,
  IntroPhase,
  ObservePhase,
  OutcomePhase,
} from './phases'
import { ResultView } from './ResultView'

const TICK_MS = 100

export function LevelScreen() {
  const { levelId } = useParams()
  const { levelOpen } = useUnlocks()
  const [run, setRun] = useState(0)
  const level = levelId ? LEVELS[levelId] : undefined

  if (!level || !levelOpen(level.id)) return <Navigate to="/lobby" replace />
  // The key gives every attempt, and every level, a fresh state machine.
  return <LevelRun key={`${level.id}:${run}`} level={level} onReplay={() => setRun((n) => n + 1)} />
}

function LevelRun({ level, onReplay }: { level: LevelDef; onReplay: () => void }) {
  const navigate = useNavigate()
  const recordResult = useSave((s) => s.recordResult)
  const [state, dispatch] = useReducer(
    (s: LevelState, e: LevelEvent) => step(level, s, e),
    undefined,
    initialState,
  )
  const [overlay, setOverlay] = useState<'hint' | 'pause' | null>(null)
  const [reward, setReward] = useState<Reward | null>(null)

  const clockRunning = isClockRunning(state)
  useEffect(() => {
    if (!clockRunning) return
    let last = performance.now()
    const timer = setInterval(() => {
      const now = performance.now()
      dispatch({ type: 'tick', ms: now - last })
      last = now
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [clockRunning])

  useLevelSounds(level, state)

  // Fetch the level's pictures up front, so none pops in late during a mini-game.
  useEffect(() => {
    const steps = level.act.type === 'sequence' ? level.act.steps : [level.act]
    preloadArt([
      level.id,
      'guide-cheer',
      'guide-relieved',
      'guide-worried',
      ...steps.flatMap((step) =>
        step.type === 'hold'
          ? [step.tool.art]
          : step.type === 'drag-place'
            ? step.items.map((item) => item.art)
            : [],
      ),
    ])
  }, [level])

  const ended = state.phase === 'outcome'
  const result = useMemo(
    () => (ended ? score(summarize(level, state)) : null),
    [ended, level, state],
  )

  if (result && reward) {
    return (
      <ResultView level={level} state={state} result={result} reward={reward} onReplay={onReplay} />
    )
  }

  const open = (kind: 'hint' | 'pause') => {
    dispatch({ type: 'pause' })
    if (kind === 'hint') dispatch({ type: 'hint' })
    setOverlay(kind)
  }
  const close = () => {
    dispatch({ type: 'resume' })
    setOverlay(null)
  }

  const phaseProps = { level, state, dispatch }

  return (
    <div className="relative flex h-full flex-col">
      <Hud
        phase={state.phase}
        remainingMs={isTimedPhase(state.phase) ? state.roundLimitMs - state.roundMs : null}
        onHint={() => open('hint')}
        onPause={() => open('pause')}
      />
      <main
        key={state.phase}
        className="flex-1 animate-screen-in overflow-y-auto px-4 pt-2 pb-[calc(1.75rem+env(safe-area-inset-bottom))]"
      >
        {state.phase === 'intro' && <IntroPhase {...phaseProps} />}
        {state.phase === 'observe' && <ObservePhase {...phaseProps} />}
        {state.phase === 'assess' && <AssessPhase {...phaseProps} />}
        {state.phase === 'choose' && <ChoosePhase {...phaseProps} />}
        {state.phase === 'act' && <ActPhase {...phaseProps} />}
        {result && (
          <OutcomePhase
            {...phaseProps}
            result={result}
            onContinue={() => setReward(recordResult(level.id, level.lesson.id, result))}
          />
        )}
      </main>

      {overlay === 'hint' && (
        <Dialog title="Gợi ý">
          <p className="text-lg leading-snug">{level.hints[state.phase]}</p>
          <Button icon="check" onClick={close}>
            Đã hiểu
          </Button>
        </Dialog>
      )}
      {overlay === 'pause' && (
        <Dialog title="Tạm dừng">
          <Button icon="play" onClick={close}>
            Chơi tiếp
          </Button>
          <Button variant="plain" icon="replay" onClick={onReplay}>
            Chơi lại từ đầu
          </Button>
          <Button variant="plain" icon="exit" onClick={() => navigate(`/area/${level.areaId}`)}>
            Thoát màn
          </Button>
        </Dialog>
      )}
    </div>
  )
}

/** Seconds left at which the clock starts to tick audibly. */
const TICK_FROM_SEC = 10

/** Plays the sound that goes with each change in the level state. */
function useLevelSounds(level: LevelDef, state: LevelState) {
  const previous = useRef(state)
  useEffect(() => {
    const before = previous.current
    previous.current = state
    if (state.cluesFound.length > before.cluesFound.length) sfx('clue')
    if (state.assessWrong.length > before.assessWrong.length) sfx('wrong')
    if (state.assessSolved && !before.assessSolved) sfx('right')
    if (state.rejected.length > before.rejected.length) {
      const id = state.rejected[state.rejected.length - 1]
      const unsafe = level.choose.options.find((o) => o.id === id)?.kind === 'unsafe'
      sfx(unsafe ? 'warn' : 'wrong')
    }
    if (state.solutionConfirmed && !before.solutionConfirmed) sfx('right')

    // The last seconds of the current round's clock.
    const left = (s: LevelState) => Math.ceil((s.roundLimitMs - s.roundMs) / 1000)
    const sameRound = state.phase === before.phase && state.actStep === before.actStep
    const now = left(state)
    if (sameRound && now !== left(before) && now <= TICK_FROM_SEC && now > 0) sfx('tick')
  }, [level, state])
}
