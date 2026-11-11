import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSessionStore } from '../store/session'
import { Avatar } from './Avatar'

export function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLAnchorElement>(null)
  const location = useLocation()
  const username = useSessionStore((state) => state.profile?.username ?? 'Player')

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    firstItemRef.current?.focus()

    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!containerRef.current?.contains(target)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="rounded-full"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close account menu' : 'Open account menu'}
        onClick={() => setOpen((current) => !current)}
      >
        <Avatar name={username} />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 z-30 mt-3 w-48 rounded-2xl border border-border bg-surface-elevated p-2 shadow-soft"
        >
          <Link ref={firstItemRef} role="menuitem" to="/profile" className="menu-item">
            Profile
          </Link>
          <Link role="menuitem" to="/settings" className="menu-item">
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="menu-item w-full text-left"
            disabled={pending}
            onClick={() => {
              setPending(true)
              void useSessionStore.getState().signOut().then(() => {
                setPending(false)
              })
            }}
          >
            {pending ? 'Logging out' : 'Log out'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
