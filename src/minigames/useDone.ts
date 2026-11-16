import { useEffect, useRef } from 'react'
import type { ActResult } from '@/game/levelMachine'
import { DONE_DELAY_MS } from './types'

/**
 * Returns a function that reports the result once, after a short pause so the
 * player can read the last feedback. Safe against double calls and unmounts.
 */
export function useDone(onDone: (result: ActResult) => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(onDone)
  useEffect(() => {
    latest.current = onDone
  })
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  return (result: ActResult) => {
    if (timer.current) return
    timer.current = setTimeout(() => latest.current(result), DONE_DELAY_MS)
  }
}
