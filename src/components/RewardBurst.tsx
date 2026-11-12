import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cn } from '../utils/cn'

export type RewardBurstProps = {
  show: boolean
}

export function RewardBurst({ show }: RewardBurstProps) {
  const reduce = usePrefersReducedMotion()
  if (!show || reduce) return null

  return (
    <span className="reward-burst" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <i key={index} />
      ))}
    </span>
  )
}

export type ConfettiProps = {
  show: boolean
  className?: string
}

export function Confetti({ show, className }: ConfettiProps) {
  const reduce = usePrefersReducedMotion()
  if (!show || reduce) return null

  return (
    <div className={cn('confetti', className)} aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}
