import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { art } from '@/art'
import { useSave } from '@/state/save'
import { Logo } from '@/ui/Logo'

/** Matches the length of the bar's fill animation (--animate-fill). */
const MIN_SHOW_MS = 2200
/** Never hold the player on this screen longer than this, even on a slow connection. */
const MAX_WAIT_MS = 4000

/** Pictures used on nearly every screen; level scenes load when a level opens. */
const PRELOAD = [
  'town',
  'player',
  'guide-neutral',
  'guide-happy',
  'guide-worried',
  'guide-surprised',
  'guide-relieved',
  'guide-cheer',
]

function preload(id: string): Promise<void> {
  const src = art(id)
  if (!src) return Promise.resolve()
  const image = new Image()
  image.src = src
  return image.decode().catch(() => undefined)
}

/** Loading screen: the town under the logo, with a bar that fills without moving the layout. */
export function BootScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const minimum = new Promise((resolve) => setTimeout(resolve, MIN_SHOW_MS))
    const assets = Promise.race([
      Promise.all([document.fonts.ready, ...PRELOAD.map(preload)]),
      new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
    ])
    void Promise.all([assets, minimum]).then(() => {
      if (cancelled) return
      const { profile, introSeen } = useSave.getState()
      navigate(profile ? '/lobby' : introSeen ? '/character' : '/intro', { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden">
      <img
        src={art('town')}
        alt=""
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <Logo className="relative mt-[16vh] text-6xl" />
      <div className="relative mt-auto mb-[max(2.5rem,env(safe-area-inset-bottom))] w-64 rounded-3xl bg-cotton/75 p-4 backdrop-blur-sm">
        <div className="h-5 overflow-hidden rounded-full border-4 border-cotton bg-cotton">
          <div className="h-full animate-fill rounded-full bg-coral" />
        </div>
        <p className="mt-2 text-center font-display text-xl font-bold text-ink">Đang tải…</p>
      </div>
    </div>
  )
}
