import { Navigate, Outlet } from 'react-router'
import { useSave } from '@/state/save'

/** Phone-sized stage: full screen on a phone, a centred column on anything wider. */
export function AppShell() {
  return (
    <div className="mx-auto h-dvh w-full max-w-[480px] overflow-hidden bg-mist">
      <Outlet />
    </div>
  )
}

/** Routes below this need a character; without one, start from the loading screen. */
export function RequireProfile() {
  const hasProfile = useSave((s) => s.profile !== null)
  return hasProfile ? <Outlet /> : <Navigate to="/" replace />
}
