import { useEffect, useState } from 'react'
import { formatCountdown } from '../utils/leaderboard'

export type ResetCountdownProps = {
  resetsAt: string
  onElapsed: () => void
}

export function ResetCountdown({ resetsAt, onElapsed }: ResetCountdownProps) {
  const [remaining, setRemaining] = useState(() => {
    const target = Date.parse(resetsAt)
    return Number.isNaN(target) ? 0 : target - Date.now()
  })

  useEffect(() => {
    const target = Date.parse(resetsAt)
    if (Number.isNaN(target)) return
    let elapsed = false
    const tick = () => {
      const next = target - Date.now()
      setRemaining(next)
      if (next <= 0 && !elapsed) {
        elapsed = true
        onElapsed()
      }
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [onElapsed, resetsAt])

  if (Number.isNaN(Date.parse(resetsAt))) return null

  return (
    <p className="reset-countdown">
      {remaining <= 0 ? 'Resetting the board.' : `Resets in ${formatCountdown(remaining)}`}
    </p>
  )
}
