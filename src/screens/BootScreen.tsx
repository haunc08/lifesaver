import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSave } from '@/state/save'
import { Logo } from '@/ui/Logo'

/** Matches the length of the bar's fill animation (--animate-fill). */
const MIN_SHOW_MS = 900

/**
 * Loading screen. Placeholder shapes: the final one follows the loading-screen
 * artwork (docs/art-and-audio.md). The bar animates without moving the layout.
 */
export function BootScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const minimum = new Promise((resolve) => setTimeout(resolve, MIN_SHOW_MS))
    void Promise.all([document.fonts.ready, minimum]).then(() => {
      if (cancelled) return
      const { profile, introSeen } = useSave.getState()
      navigate(profile ? '/lobby' : introSeen ? '/character' : '/intro', { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 overflow-hidden px-6">
      <span aria-hidden className="absolute top-[11%] -left-10 h-14 w-44 rounded-full bg-cotton" />
      <span aria-hidden className="absolute top-[23%] -right-8 h-10 w-32 rounded-full bg-cotton" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-mint" />

      <Logo className="relative text-6xl" />
      <div className="relative w-full max-w-64">
        <div className="h-5 overflow-hidden rounded-full border-4 border-cotton bg-cotton">
          <div className="h-full animate-fill rounded-full bg-coral" />
        </div>
        <p className="mt-3 text-center font-display text-xl font-bold text-ink">Đang tải…</p>
      </div>
    </div>
  )
}
