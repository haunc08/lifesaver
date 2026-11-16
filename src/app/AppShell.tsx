import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { setBackground } from '@/audio'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE } from '@/content/levels'
import type { AreaId } from '@/game/types'
import { useSave } from '@/state/save'

/** The area a screen belongs to: an area's level list, or one of its levels. */
function areaOf(pathname: string): AreaId | null {
  const [, section, id] = pathname.split('/')
  if (section === 'area') return AREAS.find((a) => a.id === id)?.id ?? null
  if (section === 'level') return LEVEL_OUTLINE.find((l) => l.id === id)?.areaId ?? null
  return null
}

/** Phone-sized stage: full screen on a phone, a centred column on anything wider. */
export function AppShell() {
  const { pathname } = useLocation()
  const area = areaOf(pathname)

  // Inside an area, the sound of that place; the town tune everywhere else.
  useEffect(
    () => setBackground(area ? { kind: 'ambience', area } : { kind: 'music', name: 'town' }),
    [area],
  )

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[480px] overflow-hidden bg-mist">
      {/* The key restarts the entrance animation on every screen change. */}
      <div key={pathname} className="h-full animate-screen-in">
        <Outlet />
      </div>
    </div>
  )
}

/** Routes below this need a character; without one, start from the loading screen. */
export function RequireProfile() {
  const hasProfile = useSave((s) => s.profile !== null)
  return hasProfile ? <Outlet /> : <Navigate to="/" replace />
}
