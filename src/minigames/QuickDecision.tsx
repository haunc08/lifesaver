import { sfx } from '@/audio'
import { useEffect, useState } from 'react'
import type { QuickDecisionConfig } from '@/game/types'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Note, type NoteData } from './Note'
import type { MinigameProps } from './types'

const TICK_MS = 100
/** Share of cards that must be right for the mini-game to count as completed. */
export const PASS_SHARE = 0.6

/** A run of cards, each answered with one of two buttons before its timer runs out. */
export function QuickDecision({ config, paused, onDone }: MinigameProps<QuickDecisionConfig>) {
  const [index, setIndex] = useState(0)
  const [right, setRight] = useState(0)
  const [leftMs, setLeftMs] = useState(config.secPerCard * 1000)
  const [note, setNote] = useState<NoteData | null>(null)
  const card = config.cards[index]
  const answered = note !== null
  const last = index === config.cards.length - 1

  const settle = (choice: 0 | 1 | null) => {
    if (answered) return
    const ok = choice === card.answer
    if (ok) setRight((n) => n + 1)
    sfx(ok ? 'right' : 'wrong')
    setNote({
      tone: ok ? 'good' : 'bad',
      text: choice === null ? `Hết giờ! ${card.why}` : card.why,
    })
  }

  const running = !answered && !paused
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setLeftMs((ms) => Math.max(0, ms - TICK_MS)), TICK_MS)
    return () => clearInterval(timer)
  }, [running])

  const timedOut = leftMs === 0 && !answered
  useEffect(() => {
    if (timedOut) settle(null)
    // `settle` only reads the current card, which cannot change while this is true.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut])

  const next = () => {
    if (last) {
      const accuracy = right / config.cards.length
      onDone({ completed: accuracy >= PASS_SHARE, accuracy })
      return
    }
    setIndex(index + 1)
    setLeftMs(config.secPerCard * 1000)
    setNote(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="text-center text-lg leading-snug">{config.instruction}</p>
      <div className="h-3 overflow-hidden rounded-full bg-cotton" aria-hidden>
        <div
          className="h-full rounded-full bg-butter-edge transition-[width] duration-100 ease-linear"
          style={{ width: `${(leftMs / (config.secPerCard * 1000)) * 100}%` }}
        />
      </div>
      <Card className="flex min-h-36 flex-col justify-center">
        <p className="text-sm font-bold text-blue-ink">
          Thẻ {index + 1}/{config.cards.length}
        </p>
        <p className="mt-1 font-display text-xl leading-snug font-bold text-ink">{card.text}</p>
      </Card>
      <Note note={note} idle="Chọn nhanh trước khi thanh thời gian chạy hết." />
      <div className="flex-1" />
      {answered ? (
        <Button icon={last ? 'check' : 'next'} onClick={next}>
          {last ? 'Hoàn thành' : 'Thẻ tiếp theo'}
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success" onClick={() => settle(0)}>
            {config.answers[0]}
          </Button>
          <Button variant="danger" onClick={() => settle(1)}>
            {config.answers[1]}
          </Button>
        </div>
      )}
    </div>
  )
}
