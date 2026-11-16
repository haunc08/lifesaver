import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { duckMusic, sfx } from '@/audio'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import type { LevelState } from '@/game/levelMachine'
import type { Reward } from '@/game/progression'
import { MAX_POINTS, type ScoreBreakdown, type ScoreResult } from '@/game/scoring'
import type { LevelDef, Outcome } from '@/game/types'
import { useUnlocks } from '@/state/unlocks'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide } from '@/ui/Guide'
import { Stars, STAR_STAGGER_MS } from '@/ui/Stars'

const OUTCOME_TITLE: Record<Outcome, string> = {
  success: 'Tuyệt vời!',
  'partial-success': 'Làm tốt lắm!',
  'recoverable-mistake': 'Suýt nữa thì được',
  'unsafe-failure': 'Chưa an toàn',
  timeout: 'Hết giờ rồi',
}

const SCORE_ROWS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: 'action', label: 'Thao tác' },
  { key: 'solution', label: 'Chọn cách xử trí' },
  { key: 'assessment', label: 'Nhận định' },
  { key: 'safety', label: 'An toàn và thứ tự' },
  { key: 'time', label: 'Thời gian' },
]

interface ReviewItem {
  ok: boolean
  text: string
  why?: string
}

/** What the player got right and wrong, with the reason for each. */
function review(level: LevelDef, state: LevelState): ReviewItem[] {
  const items: ReviewItem[] = []
  const right = level.assess.options.find((o) => o.correct)

  for (const id of state.assessWrong) {
    const o = level.assess.options.find((x) => x.id === id)
    if (o) items.push({ ok: false, text: `Nhận định: ${o.text}`, why: o.feedback })
  }
  if (right) {
    items.push(
      state.assessSolved
        ? { ok: true, text: `Nhận định: ${right.text}` }
        : { ok: false, text: 'Chưa nhận định đúng tình huống', why: `Đáp án: ${right.text}.` },
    )
  }

  if (state.assessSolved) {
    for (const id of state.rejected) {
      const o = level.choose.options.find((x) => x.id === id)
      if (o) items.push({ ok: false, text: o.text, why: o.feedback })
    }
    const { order } = level.choose
    const places = state.picks.map((id) => order.indexOf(id))
    if (places.some((place, i) => i > 0 && place < places[i - 1])) {
      items.push({
        ok: false,
        text: 'Thứ tự bạn chọn chưa hợp lý',
        why: 'Thứ tự nên làm là thứ tự được đánh số dưới đây.',
      })
    }
    // The right steps, in the order they should be done.
    order.forEach((stepId, i) => {
      const step = level.choose.options.find((x) => x.id === stepId)
      if (!step) return
      const picked = state.picks.includes(stepId)
      items.push({
        ok: picked,
        text: `${picked ? '' : 'Chưa làm: '}${i + 1}. ${step.text}`,
        why: step.feedback,
      })
    })
  }
  return items
}

/** The score counts up over this long, and the first star lands as it finishes. */
const COUNT_UP_MS = 700

/** Counts from 0 to `target`; jumps straight there when the player prefers less motion. */
function useCountUp(target: number, ms: number): number {
  const [value, setValue] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? target : 0,
  )
  useEffect(() => {
    if (value === target) return
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const share = Math.min(1, (now - start) / ms)
      setValue(Math.round(target * share))
      if (share < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
    // Runs once per result; `value` is only read to skip the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms])
  return value
}

interface Props {
  level: LevelDef
  state: LevelState
  result: ScoreResult
  reward: Reward
  onReplay: () => void
}

export function ResultView({ level, state, result, reward, onReplay }: Props) {
  const navigate = useNavigate()
  const { levelOpen } = useUnlocks()
  const shown = useCountUp(result.total, COUNT_UP_MS)

  // The jingle, then one chime per star as it lands.
  useEffect(() => {
    sfx(result.passed ? 'pass' : 'fail')
    duckMusic(1500)
    const timers = Array.from({ length: result.stars }, (_, i) =>
      setTimeout(() => sfx('star'), COUNT_UP_MS + i * STAR_STAGGER_MS),
    )
    return () => timers.forEach(clearTimeout)
  }, [result.passed, result.stars])

  const index = LEVEL_OUTLINE.findIndex((l) => l.id === level.id)
  const following = LEVEL_OUTLINE[index + 1]
  const nextOpen =
    following !== undefined && LEVELS[following.id] !== undefined && levelOpen(following.id)
  // The next level in the same area starts straight away. The first level of a new
  // area does not: the player is taken to that area first.
  const nextArea =
    nextOpen && following.areaId !== level.areaId
      ? AREAS.find((a) => a.id === following.areaId)
      : undefined

  return (
    <div className="h-full space-y-3 overflow-y-auto px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
      <Card className="text-center">
        <Guide mood={result.passed ? 'cheer' : 'worried'} className="mx-auto h-24 animate-pop" />
        <h1 className="font-display text-3xl font-bold text-ink">
          {OUTCOME_TITLE[result.outcome]}
        </h1>
        <Stars count={result.stars} className="text-5xl" revealAfterMs={COUNT_UP_MS} />
        <p className="font-display text-4xl font-extrabold text-blue-ink">
          {shown}
          <span className="text-xl text-ink-soft"> / 100</span>
        </p>
        <p className="mt-1 text-ink-soft">
          {reward.xp > 0
            ? `+${reward.xp} kinh nghiệm${reward.threeStarBonus ? ' (có thưởng 3 sao)' : ''}`
            : result.passed
              ? 'Bạn đã nhận thưởng của màn này rồi.'
              : 'Vượt qua màn để nhận kinh nghiệm.'}
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-bold text-ink">Điểm số</h2>
        <dl className="mt-1 space-y-1">
          {SCORE_ROWS.map(({ key, label }) => (
            <div key={key} className="flex justify-between">
              <dt>{label}</dt>
              <dd className="font-bold tabular-nums">
                {result.breakdown[key]} / {MAX_POINTS[key]}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-bold text-ink">Bạn đã làm gì</h2>
        <ul className="mt-1 space-y-2">
          {review(level, state).map((item) => (
            <li key={item.text} className="flex gap-2 leading-snug">
              <span aria-hidden className={item.ok ? 'text-mint-ink' : 'text-coral-ink'}>
                {item.ok ? '✓' : '✕'}
              </span>
              <span>
                <span className="sr-only">{item.ok ? 'Đúng: ' : 'Chưa đúng: '}</span>
                {item.text}
                {item.why && <span className="block text-sm text-ink-soft">{item.why}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-bold text-coral-ink">Khi nào cần gọi trợ giúp</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5 leading-snug">
          {level.lesson.callForHelp.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="plain" icon="book" onClick={() => navigate(`/library/${level.lesson.id}`)}>
          Bài học
        </Button>
        <Button variant="plain" icon="replay" onClick={onReplay}>
          Chơi lại
        </Button>
        {nextArea ? (
          <Button
            className="col-span-2"
            icon="map"
            onClick={() => navigate(`/area/${nextArea.id}`)}
          >
            Đến khu mới: {nextArea.name}
          </Button>
        ) : nextOpen ? (
          <Button
            className="col-span-2"
            icon="next"
            onClick={() => navigate(`/level/${following.id}`)}
          >
            Màn tiếp theo
          </Button>
        ) : (
          <Button
            className="col-span-2"
            icon="list"
            onClick={() => navigate(`/area/${level.areaId}`)}
          >
            Về danh sách màn
          </Button>
        )}
      </div>
    </div>
  )
}
