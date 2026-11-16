import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { setMusic } from '@/audio'
import { useSave } from '@/state/save'

/** Phone-sized stage: full screen on a phone, a centred column on anything wider. */
export function AppShell() {
  const { pathname } = useLocation()
  const inLevel = pathname.startsWith('/level/')

  // Calm music inside a level, the town tune everywhere else.
  useEffect(() => setMusic(inLevel ? 'level' : 'town'), [inLevel])

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
