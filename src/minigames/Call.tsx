import { useEffect, useRef, useState } from 'react'
import { art } from '@/art'
import { sfx } from '@/audio'
import { SERVICES } from '@/content/emergency'
import type { CallConfig } from '@/game/types'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Note, type NoteData } from './Note'
import { accuracyOf, type MinigameProps } from './types'

const MAX_DIGITS = 6
/** After this many wrong numbers the right one is given away. */
const DIALS_BEFORE_ANSWER = 2
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A phone call in two parts: dial the right emergency number, then answer the
 * dispatcher's questions. A wrong number or an unhelpful reply is explained and
 * can be tried again; the call ends only when the dispatcher says so.
 */
export function Call({ config, onDone }: MinigameProps<CallConfig>) {
  const [digits, setDigits] = useState('')
  const [connected, setConnected] = useState(false)
  const [turn, setTurn] = useState(0)
  /** Replies already tried and refused in the current turn. */
  const [refused, setRefused] = useState<string[]>([])
  const [note, setNote] = useState<NoteData | null>(null)
  const slips = useRef(0)
  const wrongDials = useRef(0)
  const latest = useRef<HTMLDivElement>(null)

  const over = turn >= config.turns.length
  const current = config.turns[turn]

  // Keep the newest line of the call on screen.
  useEffect(() => {
    latest.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [turn, connected])

  const press = (key: string) => {
    sfx('tap')
    setDigits((d) => (d.length < MAX_DIGITS ? d + key : d))
  }

  const dial = () => {
    if (digits === '') return
    if (digits === config.number) {
      sfx('right')
      setConnected(true)
      setNote(null)
      return
    }
    slips.current += 1
    wrongDials.current += 1
    sfx('wrong')
    const what =
      digits in SERVICES
        ? `${digits} là số gọi ${SERVICES[digits as CallConfig['number']]}. Lúc này cần gọi ${SERVICES[config.number]}.`
        : `${digits} không phải số khẩn cấp. Ba số cần nhớ: 113 công an, 114 cứu hoả, 115 cấp cứu y tế.`
    const answer =
      wrongDials.current >= DIALS_BEFORE_ANSWER ? ` Số cần bấm là ${config.number}.` : ''
    setNote({ tone: 'bad', text: what + answer })
    setDigits('')
  }

  const reply = (id: string) => {
    const chosen = current.replies.find((r) => r.id === id)
    if (!chosen || refused.includes(id)) return
    if (!chosen.right) {
      slips.current += 1
      sfx('wrong')
      setRefused([...refused, id])
      setNote({ tone: 'bad', text: chosen.why })
      return
    }
    sfx('right')
    setNote({ tone: 'good', text: chosen.why })
    setRefused([])
    setTurn(turn + 1)
  }

  const hangUp = () =>
    onDone({ completed: true, accuracy: accuracyOf(config.turns.length + 1, slips.current) })

  if (!connected) {
    return (
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-center text-lg leading-snug">{config.instruction}</p>
        <Card className="space-y-3">
          <p
            aria-label="Số đang bấm"
            aria-live="polite"
            className="flex h-14 items-center justify-center rounded-2xl bg-mist font-display text-4xl font-bold tracking-[0.2em] text-ink tabular-nums"
          >
            {digits || <span className="text-xl tracking-normal text-ink-soft">Bấm số</span>}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((key) => (
              <Button
                key={key}
                variant="plain"
                className="!py-2 !text-2xl"
                onClick={() => press(key)}
              >
                {key}
              </Button>
            ))}
            <Button
              variant="plain"
              aria-label="Xoá số"
              className="!py-2"
              icon="erase"
              onClick={() => setDigits((d) => d.slice(0, -1))}
            />
            <Button variant="plain" className="!py-2 !text-2xl" onClick={() => press('0')}>
              0
            </Button>
            <Button
              variant="success"
              aria-label="Gọi"
              className="!py-2"
              icon="phone"
              onClick={dial}
            />
          </div>
        </Card>
        <Note note={note} idle="Bấm số khẩn cấp phù hợp rồi chạm nút gọi màu xanh." />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-3 rounded-3xl bg-cotton px-3 py-2">
        <img
          src={art('operator')}
          alt=""
          className="size-12 rounded-full bg-mint/50 object-cover"
        />
        <p className="font-display text-lg leading-tight font-bold text-ink">
          {config.callee}
          <span className="block font-sans text-sm font-normal text-ink-soft">
            {over ? 'Tổng đài đã nhận đủ thông tin' : `Câu hỏi ${turn + 1}/${config.turns.length}`}
          </span>
        </p>
      </div>
      <div className="space-y-2">
        {/* What has been said so far: each question with the reply that answered it. */}
        {config.turns.slice(0, turn).map((t) => (
          <div key={t.id} className="space-y-1.5 opacity-70">
            <p className="mr-10 rounded-2xl rounded-tl-md bg-cotton px-3 py-1.5 text-sm leading-snug">
              {t.ask}
            </p>
            <p className="ml-10 rounded-2xl rounded-tr-md bg-blue/60 px-3 py-1.5 text-sm leading-snug">
              {t.replies.find((r) => r.right)?.text}
            </p>
          </div>
        ))}
        <div
          ref={latest}
          key={turn}
          className="mr-6 animate-pop rounded-2xl rounded-tl-md border-2 border-mist-edge bg-cotton px-3 py-2 text-lg leading-snug font-bold"
        >
          {over ? config.closing : current.ask}
        </div>
      </div>
      <Note
        note={note}
        idle="Chọn câu trả lời giúp tổng đài viên hiểu rõ nhất. Nói ngắn, rõ, đúng sự thật."
      />
      <div className="flex-1" />
      {over ? (
        <Button variant="danger" icon="phone" onClick={hangUp}>
          Cúp máy
        </Button>
      ) : (
        <div className="space-y-2">
          {current.replies.map((r) => {
            const off = refused.includes(r.id)
            return (
              <Button
                key={r.id}
                variant="plain"
                aria-disabled={off}
                onClick={() => reply(r.id)}
                className={`w-full !px-3 !py-2 text-left !font-sans !text-base ${off ? 'text-ink-soft line-through opacity-60 shadow-none' : ''}`}
              >
                {r.text}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
