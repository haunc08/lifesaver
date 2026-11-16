import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { setBackground } from '@/audio'
import { LEVEL_OUTLINE } from '@/content/levels'
import type { AreaId } from '@/game/types'
import { useSave } from '@/state/save'

/** The level a screen belongs to: only a level has the sound of a place; menus keep the town tune. */
function levelOf(pathname: string): { id: string; areaId: AreaId } | null {
  const [, section, id] = pathname.split('/')
  if (section === 'level') return LEVEL_OUTLINE.find((l) => l.id === id) ?? null
  return null
}

/** Phone-sized stage: full screen on a phone, a centred column on anything wider. */
export function AppShell() {
  const { pathname } = useLocation()
  const level = levelOf(pathname)
  const levelId = level?.id
  const area = level?.areaId

  // Inside a level, the sound of its place; the town tune everywhere else.
  useEffect(
    () =>
      setBackground(area ? { kind: 'ambience', area, levelId } : { kind: 'music', name: 'town' }),
    [area, levelId],
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
