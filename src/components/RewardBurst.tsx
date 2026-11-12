import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

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
}

export function Confetti({ show }: ConfettiProps) {
  const reduce = usePrefersReducedMotion()
  if (!show || reduce) return null

  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}
