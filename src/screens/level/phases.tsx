import { useEffect, useState, type Dispatch } from 'react'
import type { Feedback, LevelEvent, LevelState } from '@/game/levelMachine'
import type { ScoreResult } from '@/game/scoring'
import type { LevelDef } from '@/game/types'
import { Minigame } from '@/minigames'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide } from '@/ui/Guide'
import { Pin } from '@/ui/Pin'
import { GUIDE_NAME } from '@/content/areas'
import { SceneBox } from './SceneBox'

/** One view per level phase. Each reads the machine state and dispatches events. */

interface PhaseProps {
  level: LevelDef
  state: LevelState
  dispatch: Dispatch<LevelEvent>
}

const TONE: Record<Feedback['tone'], string> = {
  good: 'border-mint-edge bg-mint/25 text-mint-ink',
  warn: 'border-butter-edge bg-butter/30 text-ink',
  bad: 'border-coral-edge bg-coral/20 text-coral-ink',
}

function FeedbackBanner({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) return null
  return (
    <p
      role="status"
      className={`rounded-2xl border-2 px-4 py-3 leading-snug ${TONE[feedback.tone]}`}
    >
      {feedback.text}
    </p>
  )
}

export function IntroPhase({ level, dispatch, canSkip }: PhaseProps & { canSkip: boolean }) {
  const [index, setIndex] = useState(0)
  const line = level.intro[index]
  const last = index === level.intro.length - 1
  const done = () => dispatch({ type: 'intro-done' })

  return (
    <div className="flex h-full flex-col gap-4">
      <SceneBox artId={level.id} scene={level.scene} />
      <Card className="flex flex-1 items-start gap-3">
        {line.speaker === GUIDE_NAME && <Guide mood={line.mood} className="size-16 shrink-0" />}
        <div className="min-w-0 flex-1">
          {line.speaker && (
            <p className="font-display text-sm font-bold text-blue-ink">{line.speaker}</p>
          )}
          <p className={`mt-1 text-lg leading-snug ${line.speaker ? '' : 'text-ink-soft italic'}`}>
            {line.text}
          </p>
        </div>
      </Card>
      <div className="flex gap-3">
        {canSkip && !last && (
          <Button variant="plain" onClick={done}>
            Bỏ qua
          </Button>
        )}
        <Button className="flex-1" onClick={last ? done : () => setIndex(index + 1)}>
          {last ? 'Quan sát hiện trường' : 'Tiếp tục'}
        </Button>
      </div>
    </div>
  )
}

/** How long the view stays zoomed in on a clue before easing back out. */
const CLUE_ZOOM_MS = 1600

export function ObservePhase({ level, state, dispatch }: PhaseProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const open = level.observe.clues.find((c) => c.id === openId)
  const found = state.cluesFound.length
  const { required } = level.observe

  useEffect(() => {
    if (!zoomed) return
    const timer = setTimeout(() => setZoomed(false), CLUE_ZOOM_MS)
    return () => clearTimeout(timer)
  }, [zoomed, openId])

  return (
    <div className="flex h-full flex-col gap-4">
      <SceneBox
        artId={level.id}
        scene={level.scene}
        focus={zoomed && open ? open : null}
        onClick={() => setZoomed(false)}
      >
        {level.observe.clues.map((clue) => {
          const seen = state.cluesFound.includes(clue.id)
          return (
            <Pin
              key={clue.id}
              x={clue.x}
              y={clue.y}
              tone={seen ? 'done' : 'todo'}
              aria-label={clue.label}
              onClick={(e) => {
                e.stopPropagation()
                setOpenId(clue.id)
                setZoomed(true)
                dispatch({ type: 'clue-found', id: clue.id })
              }}
              className={zoomed && openId !== clue.id ? 'opacity-0' : ''}
            >
              {seen ? '✓' : '?'}
            </Pin>
          )
        })}
      </SceneBox>
      <Card className="flex-1">
        {open ? (
          <>
            <p className="font-display text-sm font-bold text-blue-ink">{open.label}</p>
            <p className="mt-1 text-lg leading-snug">{open.caption}</p>
          </>
        ) : (
          <p className="text-lg leading-snug">Chạm vào các dấu “?” để tìm manh mối.</p>
        )}
      </Card>
      <Button disabled={found < required} onClick={() => dispatch({ type: 'observe-done' })}>
        {found < required ? `Đã xem ${found}/${required} manh mối` : 'Mình đã rõ rồi'}
      </Button>
    </div>
  )
}

export function AssessPhase({ level, state, dispatch }: PhaseProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="text-center font-display text-2xl font-bold text-ink">
        {level.assess.question}
      </h2>
      <FeedbackBanner feedback={state.feedback} />
      <div className="flex-1 space-y-3">
        {level.assess.options.map((o) => (
          <Button
            key={o.id}
            variant="plain"
            className="w-full text-left"
            disabled={state.assessWrong.includes(o.id)}
            onClick={() => dispatch({ type: 'assess-answer', id: o.id })}
          >
            {o.text}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function ChoosePhase({ level, state, dispatch }: PhaseProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="text-center font-display text-xl font-bold text-ink">{level.choose.prompt}</h2>
      <FeedbackBanner feedback={state.feedback} />
      <div className="flex-1 space-y-2.5">
        {level.choose.options.map((o) => {
          const position = state.picks.indexOf(o.id) + 1
          const blocked = state.rejected.includes(o.id)
          return (
            <button
              key={o.id}
              type="button"
              disabled={position > 0 || blocked}
              onClick={() => dispatch({ type: 'pick', id: o.id })}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left leading-snug transition-transform active:translate-y-0.5 ${position > 0 ? 'border-blue-edge bg-blue/25' : blocked ? 'border-mist-deep bg-cotton/50 text-ink-soft line-through' : 'border-cotton bg-cotton'}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display font-bold ${position > 0 ? 'bg-blue text-ink' : 'bg-mist text-ink-soft'}`}
              >
                {position > 0 ? position : blocked ? '✕' : ''}
              </span>
              {o.text}
            </button>
          )
        })}
      </div>
      <div className="flex gap-3">
        <Button
          variant="plain"
          disabled={state.picks.length === 0}
          onClick={() => dispatch({ type: 'undo-pick' })}
        >
          Bỏ bước cuối
        </Button>
        <Button
          className="flex-1"
          variant="success"
          disabled={state.picks.length === 0}
          onClick={() => dispatch({ type: 'confirm-solution' })}
        >
          Thực hiện
        </Button>
      </div>
    </div>
  )
}

export function ActPhase({ level, state, dispatch }: PhaseProps) {
  return (
    <Minigame
      config={level.act}
      artId={level.id}
      scene={level.scene}
      paused={state.paused}
      onDone={(result) => dispatch({ type: 'act-done', result })}
    />
  )
}

export function OutcomePhase({
  level,
  state,
  result,
  onContinue,
}: PhaseProps & { result: ScoreResult; onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col gap-4">
      <SceneBox artId={level.id} scene={level.scene} />
      <FeedbackBanner feedback={state.feedback} />
      <Card className="flex flex-1 items-start gap-3">
        <Guide mood={result.passed ? 'relieved' : 'worried'} className="size-16 shrink-0" />
        <p className="min-w-0 flex-1 text-lg leading-snug">{level.outcomes[result.outcome]}</p>
      </Card>
      <Button onClick={onContinue}>Xem kết quả</Button>
    </div>
  )
}
