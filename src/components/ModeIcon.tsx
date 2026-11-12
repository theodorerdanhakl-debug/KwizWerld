import type { ReactNode } from 'react'
import type { ModeId } from '../data/content'

export type ModeIconProps = {
  id: ModeId
}

type IconProps = {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return (
    <svg className="mode-glyph" viewBox="0 0 48 48" aria-hidden="true">
      {children}
    </svg>
  )
}

export function ModeIcon({ id }: ModeIconProps) {
  if (id === 'learn') {
    return (
      <Icon>
        <path d="M8 14h14v22H8zM26 14h14v22H26z" />
        <path d="M24 14v22" />
      </Icon>
    )
  }
  if (id === 'study') {
    return (
      <Icon>
        <rect x="14" y="10" width="22" height="26" rx="3" />
        <path d="M12 16H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h16" />
      </Icon>
    )
  }
  return (
    <Icon>
      <circle cx="24" cy="24" r="14" />
      <path d="m16 24 6 6 10-12" />
    </Icon>
  )
}
