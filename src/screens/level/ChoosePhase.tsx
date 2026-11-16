import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { sfx } from '@/audio'
import { chooseStage, inOrder } from '@/game/levelMachine'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { FeedbackBanner } from './FeedbackBanner'
import type { PhaseProps } from './phases'

/**
 * Decide what to do, in two steps. First pick every right step: a pick is final
 * and picking ends by itself. Then put the picked steps in order and press
 * "Thực hiện"; the game says whether the order was right and, if it was not,
 * shows the steps rearranged before the action starts.
 */
export function ChoosePhase(props: PhaseProps) {
  const stage = chooseStage(props.level, props.state)
  const root = useRef<HTMLDivElement>(null)
  // A long list of options may have been scrolled; the next step starts from its top.
  useEffect(() => {
    if (stage !== 'pick') root.current?.scrollIntoView({ block: 'start' })
  }, [stage])
  return (
    <div ref={root} className="flex min-h-full scroll-mt-4 flex-col gap-3">
      {stage === 'pick' ? <Pick {...props} /> : <Arrange {...props} />}
    </div>
  )
}

function Pick({ level, state, dispatch }: PhaseProps) {
  return (
    <>
      <h2 className="text-center font-display text-xl font-bold text-ink">{level.choose.prompt}</h2>
      <p className="-mt-2 text-center text-sm leading-snug text-ink-soft">
        Chọn mọi việc nên làm, chưa cần đúng thứ tự.{' '}
        <span className="font-bold whitespace-nowrap text-blue-ink">
          Đã chọn {state.picks.length}/{level.choose.order.length} việc
        </span>
      </p>
      <FeedbackBanner feedback={state.feedback} />
      <div className="flex-1 space-y-2.5">
        {level.choose.options.map((o) => {
          const picked = state.picks.includes(o.id)
          const blocked = state.rejected.includes(o.id)
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked || blocked}
              onClick={() => dispatch({ type: 'pick', id: o.id })}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left leading-snug transition-transform active:translate-y-0.5 ${picked ? 'border-mint-edge bg-mint/30' : blocked ? 'border-mist-deep bg-cotton/50 text-ink-soft line-through' : 'border-mist-edge bg-cotton shadow-[0_3px_0_var(--color-mist-edge)]'}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display font-bold ${picked ? 'bg-mint text-ink' : 'bg-mist text-ink-soft'}`}
              >
                {picked ? '✓' : blocked ? '✕' : ''}
              </span>
              {o.text}
            </button>
          )
        })}
      </div>
    </>
  )
}

/** A row being dragged: which one, where the finger is, and where on the row it took hold. */
interface Drag {
  id: string
  y: number
  grab: number
}

function moved(ids: string[], from: number, to: number): string[] {
  const next = [...ids]
  next.splice(to, 0, ...next.splice(from, 1))
  return next
}

/** How far past a neighbour's middle the dragged row must go before the two change places. */
const SWAP_MARGIN_PX = 4
/** How long the rows take to slide into the right order. */
const SETTLE_MS = 450

/**
 * The picked steps as a list to put in order by dragging (or with the arrow
 * keys). After "Thực hiện" the same list shows the right order, with the rows
 * the player had elsewhere marked and explained.
 */
function Arrange({ level, state, dispatch }: PhaseProps) {
  const confirmed = state.solutionConfirmed
  // Start from the order the options were listed in, which is never the answer.
  const [ids, setIds] = useState(() =>
    level.choose.options.filter((o) => state.picks.includes(o.id)).map((o) => o.id),
  )
  const [drag, setDrag] = useState<Drag | null>(null)
  const list = useRef<HTMLOListElement>(null)
  const rows = useRef(new Map<string, HTMLLIElement>())
  /** Row to give the keyboard focus back to, after the list was rearranged under it. */
  const refocus = useRef<string | null>(null)
  /** Where each row was on the page when "Thực hiện" was pressed. */
  const before = useRef<Map<string, number> | null>(null)

  const right = inOrder(level, state.picks)
  const shown = confirmed ? level.choose.order : ids

  /** Top of the dragged row on the page, kept inside the list. */
  const dragTop = (d: Drag, row: HTMLElement) => {
    const box = list.current!.getBoundingClientRect()
    return Math.max(box.top, Math.min(box.bottom - row.offsetHeight, d.y - d.grab))
  }

  // The dragged row follows the finger; set after every render, because a swap moves the row.
  useLayoutEffect(() => {
    for (const [id, row] of rows.current) {
      if (!drag || drag.id !== id) {
        row.style.transform = ''
        continue
      }
      const natural = list.current!.getBoundingClientRect().top + row.offsetTop
      row.style.transform = `translateY(${dragTop(drag, row) - natural}px)`
    }
    if (refocus.current) {
      rows.current.get(refocus.current)?.focus()
      refocus.current = null
    }
  })

  // Once confirmed, the rows slide from where the player put them to the right order.
  useLayoutEffect(() => {
    const tops = before.current
    before.current = null
    if (!confirmed || !tops) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (const [id, row] of rows.current) {
      const from = tops.get(id)
      if (from === undefined) continue
      const delta = from - row.getBoundingClientRect().top
      if (Math.abs(delta) < 1) continue
      row.animate([{ transform: `translateY(${delta}px)` }, { transform: 'none' }], {
        duration: SETTLE_MS,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      })
    }
  }, [confirmed])

  // The list takes the gesture, not the row: a row that changes place would lose the pointer.
  const onDown = (e: PointerEvent<HTMLOListElement>) => {
    if (confirmed) return
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-row]')
    if (!row) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      id: row.dataset.row!,
      y: e.clientY,
      grab: e.clientY - row.getBoundingClientRect().top,
    })
  }

  const onMove = (e: PointerEvent<HTMLOListElement>) => {
    if (!drag) return
    const next = { ...drag, y: e.clientY }
    setDrag(next)
    const row = rows.current.get(drag.id)
    if (!row) return
    const listTop = list.current!.getBoundingClientRect().top
    const top = dragTop(next, row)
    const bottom = top + row.offsetHeight
    const centreOf = (id: string) => {
      const other = rows.current.get(id)!
      return listTop + other.offsetTop + other.offsetHeight / 2
    }
    // Change places with a neighbour once the dragged row's leading edge is past the
    // neighbour's middle. The margin keeps a row on the boundary from flipping back and forth.
    const at = ids.indexOf(drag.id)
    const to =
      at < ids.length - 1 && bottom > centreOf(ids[at + 1]) + SWAP_MARGIN_PX
        ? at + 1
        : at > 0 && top < centreOf(ids[at - 1]) - SWAP_MARGIN_PX
          ? at - 1
          : at
    if (to === at) return
    setIds(moved(ids, at, to))
    sfx('tick')
  }

  const onKey = (e: KeyboardEvent, id: string) => {
    if (confirmed || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
    e.preventDefault()
    const at = ids.indexOf(id)
    const to = at + (e.key === 'ArrowUp' ? -1 : 1)
    if (to < 0 || to >= ids.length) return
    refocus.current = id
    setIds(moved(ids, at, to))
    sfx('tick')
  }

  const carryOut = () => {
    before.current = new Map(
      [...rows.current].map(([id, row]) => [id, row.getBoundingClientRect().top]),
    )
    dispatch({ type: 'confirm-order', order: ids })
  }

  return (
    <>
      <h2 className="text-center font-display text-xl font-bold text-ink">
        {confirmed ? 'Thứ tự nên làm' : 'Việc nào làm trước?'}
      </h2>
      {confirmed ? (
        <FeedbackBanner
          feedback={
            right
              ? { tone: 'good', text: 'Đúng thứ tự rồi!' }
              : {
                  tone: 'warn',
                  text: 'Thứ tự chưa hợp lý. Các việc đã được xếp lại theo thứ tự nên làm; xem những việc được đánh dấu nhé.',
                }
          }
        />
      ) : (
        <p className="-mt-2 text-center text-sm leading-snug text-ink-soft">
          Giữ và kéo từng việc lên hoặc xuống, theo thứ tự bạn sẽ làm. Việc làm trước nằm trên.
        </p>
      )}
      <ol
        ref={list}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        data-sfx="none"
        className={`relative flex-1 space-y-2.5 ${confirmed ? '' : 'touch-none select-none [-webkit-touch-callout:none]'}`}
      >
        {shown.map((id, i) => {
          const option = level.choose.options.find((o) => o.id === id)!
          const was = state.picks.indexOf(id)
          const misplaced = confirmed && !right && was !== i
          const held = drag?.id === id
          return (
            <li
              key={id}
              ref={(row) => {
                if (row) rows.current.set(id, row)
                else rows.current.delete(id)
              }}
              data-row={id}
              data-index={i}
              tabIndex={confirmed ? -1 : 0}
              aria-label={confirmed ? undefined : `Việc thứ ${i + 1}: ${option.text}`}
              onKeyDown={(e) => onKey(e, id)}
              className={`relative flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 leading-snug ${
                confirmed
                  ? misplaced
                    ? 'border-butter-edge bg-butter/30'
                    : 'border-mint-edge bg-mint/25'
                  : held
                    ? 'z-10 scale-[1.03] border-blue-edge bg-cotton shadow-[0_7px_0_var(--color-blue-edge)]'
                    : 'border-mist-edge bg-cotton shadow-[0_3px_0_var(--color-mist-edge)]'
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display font-bold text-ink ${confirmed ? (misplaced ? 'bg-butter' : 'bg-mint') : 'bg-blue'}`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                {option.text}
                {misplaced && (
                  <span className="mt-1 block text-sm leading-snug text-ink-soft">
                    <span className="font-bold text-ink">Bạn xếp việc này thứ {was + 1}.</span>{' '}
                    {option.feedback}
                  </span>
                )}
              </span>
              {!confirmed && <Icon name="grip" className="size-6 text-ink-soft" />}
            </li>
          )
        })}
      </ol>
      {confirmed ? (
        <Button icon="next" onClick={() => dispatch({ type: 'start-act' })}>
          Tiếp tục
        </Button>
      ) : (
        <Button icon="check" onClick={carryOut}>
          Thực hiện
        </Button>
      )}
    </>
  )
}
