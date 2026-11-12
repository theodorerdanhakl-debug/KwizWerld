import { useEffect, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useEconomyStore } from '../store/economy'
import { formatBalance } from '../utils/formatBalance'
import { levelProgress } from '../utils/level'
import { cn } from '../utils/cn'

export function Balance() {
  const exp = useEconomyStore((state) => state.exp)
  const diamonds = useEconomyStore((state) => state.diamonds)
  const grant = useEconomyStore((state) => state.grant)
  const reduce = usePrefersReducedMotion()
  const shownExp = useCountUp(exp, { reduce })
  const shownDiamonds = useCountUp(diamonds, { reduce })
  const [spark, setSpark] = useState(false)

  useEffect(() => {
    if (!grant || grant.diamonds <= 0 || reduce) return
    const on = window.setTimeout(() => setSpark(true), 260)
    const off = window.setTimeout(() => setSpark(false), 540)
    return () => {
      window.clearTimeout(on)
      window.clearTimeout(off)
      setSpark(false)
    }
  }, [grant, reduce])

  if (shownExp === null || shownDiamonds === null) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>EXP —</span>
        <span>Diamonds —</span>
      </div>
    )
  }

  const progress = levelProgress(shownExp)
  const percent = Math.round(progress.ratio * 100)

  return (
    <div className="flex items-center gap-3">
      <div className="reward-exp">
        <span className={cn('reward-level', grant?.leveledUp && !reduce && 'reward-level-up')}>Lv {progress.level}</span>
        <div
          className="reward-exp-track"
          role="progressbar"
          aria-label="EXP"
          aria-valuemin={0}
          aria-valuemax={progress.needed}
          aria-valuenow={progress.current}
          aria-valuetext={`Level ${progress.level}, ${progress.current} of ${progress.needed} EXP`}
        >
          <div className="reward-exp-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className={cn('reward-diamond', spark && 'is-sparkling')} data-reward-diamond>
        <svg viewBox="0 0 16 16" className="reward-gem" aria-hidden="true">
          <path d="M8 2.2 12.6 6.4 8 13.8 3.4 6.4 8 2.2Z" />
        </svg>
        <span>{formatBalance(shownDiamonds)}</span>
      </div>
    </div>
  )
}
