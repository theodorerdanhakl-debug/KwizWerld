import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSessionStore } from '../store/session'
import { safeNextPath } from '../utils/accountForm'
import { SessionLoading } from './SessionLoading'

export type GuestOnlyProps = {
  children: ReactNode
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const status = useSessionStore((state) => state.status)
  const userId = useSessionStore((state) => state.userId)
  const location = useLocation()

  if (status === 'loading') return <SessionLoading />
  if (userId) return <Navigate to={safeNextPath(location.state)} replace />
  return children
}
