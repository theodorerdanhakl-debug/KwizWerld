import { NavLink, Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Balance } from './Balance'
import { ProfileMenu } from './ProfileMenu'

function navClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'rounded-2xl px-1 py-1 text-sm transition-base',
    isActive ? 'font-semibold text-text' : 'text-muted hover:text-text',
  )
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:contents">
          <Link to="/home" className="font-display text-xl font-semibold">
            KwizWerld!
          </Link>
          <div className="sm:hidden">
            <ProfileMenu />
          </div>
        </div>
        <nav aria-label="Main" className="flex items-center justify-center gap-6 sm:justify-start">
          <NavLink to="/games" className={navClass}>
            Games
          </NavLink>
          <NavLink to="/gacha" className={navClass}>
            Gacha
          </NavLink>
          <NavLink to="/leaderboard" className={navClass}>
            Leaderboard
          </NavLink>
        </nav>
        <div className="flex items-center justify-center gap-2 sm:ml-auto">
          <Balance />
          <div className="hidden sm:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
