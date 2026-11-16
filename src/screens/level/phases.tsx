import { useState, type Dispatch } from 'react'
import type { LevelEvent, LevelState } from '@/game/levelMachine'
import type { ScoreResult } from '@/game/scoring'
import type { LevelDef } from '@/game/types'
import { Minigame } from '@/minigames'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide } from '@/ui/Guide'
import { Pin } from '@/ui/Pin'
import { GUIDE_NAME } from '@/content/areas'
import { FeedbackBanner } from './FeedbackBanner'
import { SceneBox } from './SceneBox'

/** One view per level phase. Each reads the machine state and dispatches events. */

export interface PhaseProps {
  level: LevelDef
  state: LevelState
  dispatch: Dispatch<LevelEvent>
}

/** The story lines, one at a time. There is no skip: every line is read, also on a replay. */
export function IntroPhase({ level, dispatch }: PhaseProps) {
  const [index, setIndex] = useState(0)
  const line = level.intro[index]
  const last = index === level.intro.length - 1
  const done = () => dispatch({ type: 'intro-done' })

  return (
    <div className="flex min-h-full flex-col gap-4">
      <SceneBox artId={level.id} scene={level.scene} />
      <Card className="flex flex-1 items-start gap-3 tall:!p-5">
        {line.speaker === GUIDE_NAME && <Guide mood={line.mood} className="size-16 shrink-0" />}
        <div className="min-w-0 flex-1">
          {line.speaker && (
            <p className="font-display text-sm font-bold text-blue-ink tall:text-base">
              {line.speaker}
            </p>
          )}
          <p
            className={`mt-1 text-lg leading-snug tall:text-xl ${line.speaker ? '' : 'text-ink-soft italic'}`}
          >
            {line.text}
          </p>
        </div>
      </Card>
      <Button icon={last ? 'eye' : 'next'} onClick={last ? done : () => setIndex(index + 1)}>
        {last ? 'Quan sát hiện trường' : 'Tiếp tục'}
      </Button>
    </div>
  )
}

/**
 * Look around the scene. Every clue looks the same; the phase can end once the
 * essential ones have been opened, however many others were looked at.
 */
export function ObservePhase({ level, state, dispatch }: PhaseProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = level.observe.clues.find((c) => c.id === openId)
  const missing = level.observe.clues.filter(
    (c) => c.essential && !state.cluesFound.includes(c.id),
  ).length

  return (
    <div className="flex min-h-full flex-col gap-4">
      <SceneBox artId={level.id} scene={level.scene} data-sfx="none">
        {level.observe.clues.map((clue) => {
          const seen = state.cluesFound.includes(clue.id)
          return (
            <Pin
              key={clue.id}
              x={clue.x}
              y={clue.y}
              tone={seen ? 'done' : 'todo'}
              aria-label={clue.label}
              aria-pressed={openId === clue.id}
              onClick={() => {
                setOpenId(clue.id)
                dispatch({ type: 'clue-found', id: clue.id })
              }}
              className={openId === clue.id ? 'z-10 scale-125 !border-ink' : ''}
            >
              {seen ? '✓' : '?'}
            </Pin>
          )
        })}
      </SceneBox>
      <Card className="flex-1 tall:!p-5">
        {open ? (
          <div key={open.id} className="animate-pop">
            <p className="font-display text-sm font-bold text-blue-ink tall:text-base">
              {open.label}
            </p>
            <p className="mt-1 text-lg leading-snug tall:text-xl">{open.caption}</p>
          </div>
        ) : (
          <p className="text-lg leading-snug tall:text-xl">Chạm vào các dấu “?” để tìm manh mối.</p>
        )}
      </Card>
      <Button
        icon={missing > 0 ? 'eye' : 'check'}
        disabled={missing > 0}
        onClick={() => dispatch({ type: 'observe-done' })}
      >
        {missing > 0 ? `Còn ${missing} điểm quan trọng chưa xem` : 'Mình đã rõ rồi'}
      </Button>
    </div>
  )
}

export function AssessPhase({ level, state, dispatch }: PhaseProps) {
  return (
    <div className="flex min-h-full flex-col gap-3">
      <h2 className="text-center font-display text-2xl font-bold text-ink">
        {level.assess.question}
      </h2>
      <FeedbackBanner feedback={state.feedback} />
      <div className="flex-1 space-y-4" data-sfx="none">
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

export function ActPhase({ level, state, dispatch }: PhaseProps) {
  return (
    // Mini-games make their own sounds, so their buttons skip the general tap sound.
    <div className="flex min-h-full flex-col" data-sfx="none">
      <Minigame
        config={level.act}
        artId={level.id}
        scene={level.scene}
        paused={state.paused}
        onStep={() => dispatch({ type: 'act-step' })}
        onDone={(result) => dispatch({ type: 'act-done', result })}
      />
    </div>
  )
}

export function OutcomePhase({
  level,
  state,
  result,
  onContinue,
}: PhaseProps & { result: ScoreResult; onContinue: () => void }) {
  return (
    <div className="flex min-h-full flex-col gap-4">
      <SceneBox artId={level.id} scene={level.scene} />
      <FeedbackBanner feedback={state.feedback} />
      <Card className="flex flex-1 items-start gap-3 tall:!p-5">
        <Guide mood={result.passed ? 'relieved' : 'worried'} className="size-16 shrink-0" />
        <p className="min-w-0 flex-1 text-lg leading-snug tall:text-xl">
          {level.outcomes[result.outcome]}
        </p>
      </Card>
      <Button icon="next" onClick={onContinue}>
        Xem kết quả
      </Button>
    </div>
  )
}
