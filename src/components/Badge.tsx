import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type BadgeTone = 'neutral' | 'accent' | 'exp' | 'diamond'

export type BadgeProps = {
  tone?: BadgeTone
  children: ReactNode
}

const tones: Record<BadgeTone, string> = {
  neutral: 'tone-neutral',
  accent: 'tone-accent',
  exp: 'tone-exp',
  diamond: 'tone-diamond',
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={cn('badge', tones[tone])}>{children}</span>
}
