import { useEffect, useMemo, useReducer, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import {
  initialState,
  isClockRunning,
  step,
  summarize,
  type LevelEvent,
  type LevelState,
} from '@/game/levelMachine'
import { isLevelUnlocked, type Reward } from '@/game/progression'
import { score } from '@/game/scoring'
import type { LevelDef } from '@/game/types'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
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
  const records = useSave((s) => s.records)
  const [run, setRun] = useState(0)
  const level = levelId ? LEVELS[levelId] : undefined

  if (!level || !isLevelUnlocked(AREAS, LEVEL_OUTLINE, records, level.id)) {
    return <Navigate to="/map" replace />
  }
  // The key gives every attempt, and every level, a fresh state machine.
  return <LevelRun key={`${level.id}:${run}`} level={level} onReplay={() => setRun((n) => n + 1)} />
}

function LevelRun({ level, onReplay }: { level: LevelDef; onReplay: () => void }) {
  const navigate = useNavigate()
  const recordResult = useSave((s) => s.recordResult)
  // Read once: whether the intro can be skipped must not change mid-run.
  const [playedBefore] = useState(() => (useSave.getState().records[level.id]?.plays ?? 0) > 0)
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
        remainingMs={level.timeLimitSec * 1000 - state.elapsedMs}
        clockRunning={clockRunning}
        onHint={() => open('hint')}
        onPause={() => open('pause')}
      />
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {state.phase === 'intro' && <IntroPhase {...phaseProps} canSkip={playedBefore} />}
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

      {overlay && (
        <div
          role="dialog"
          aria-modal
          aria-label={overlay === 'hint' ? 'Gợi ý' : 'Tạm dừng'}
          className="absolute inset-0 z-10 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-6"
        >
          <Card className="w-full space-y-3">
            <h2 className="font-display text-2xl font-bold text-ink">
              {overlay === 'hint' ? 'Gợi ý' : 'Tạm dừng'}
            </h2>
            {overlay === 'hint' ? (
              <>
                <p className="text-lg leading-snug">{level.hints[state.phase]}</p>
                <Button className="w-full" onClick={close}>
                  Đã hiểu
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" onClick={close}>
                  Chơi tiếp
                </Button>
                <Button variant="plain" className="w-full" onClick={onReplay}>
                  Chơi lại từ đầu
                </Button>
                <Button
                  variant="plain"
                  className="w-full"
                  onClick={() => navigate(`/area/${level.areaId}`)}
                >
                  Thoát màn
                </Button>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
