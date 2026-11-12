import type { ReactNode } from 'react'
import type { SubjectId } from '../data/content'

export type SubjectIconProps = {
  id: SubjectId
}

type IconProps = {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return (
    <svg className="door-icon" viewBox="0 0 48 48" aria-hidden="true">
      {children}
    </svg>
  )
}

export function SubjectIcon({ id }: SubjectIconProps) {
  if (id === 'math') {
    return (
      <Icon>
        <path d="M24 8 40 38H8Z" />
      </Icon>
    )
  }
  if (id === 'english') {
    return (
      <Icon>
        <path d="M10 16h28M10 24h22M10 32h16" />
      </Icon>
    )
  }
  if (id === 'geography') {
    return (
      <Icon>
        <path d="M6 34 18 16l8 12 6-8 10 14" />
        <circle cx="34" cy="12" r="3" />
      </Icon>
    )
  }
  if (id === 'science') {
    return (
      <Icon>
        <circle cx="24" cy="24" r="4" />
        <ellipse cx="24" cy="24" rx="16" ry="7" />
      </Icon>
    )
  }
  return (
    <Icon>
      <path d="M14 36V18M34 36V18M14 18h20" />
      <path d="M16 18c0-6 16-6 16 0" />
    </Icon>
  )
}
