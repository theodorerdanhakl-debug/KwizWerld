import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSessionStore } from '../store/session'
import { SessionLoading } from './SessionLoading'

export function RequireAuth() {
  const status = useSessionStore((state) => state.status)
  const userId = useSessionStore((state) => state.userId)
  const location = useLocation()

  if (status === 'loading') return <SessionLoading />
  if (!userId) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
