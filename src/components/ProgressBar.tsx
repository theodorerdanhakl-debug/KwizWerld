import { Skeleton } from './Skeleton'

export type ProgressBarProps = {
  value: number | null
  max?: number
  label: string
}

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  if (value === null) {
    return (
      <div>
        <p className="text-sm">{label}</p>
        <Skeleton pulse={false} className="mt-3 h-2 w-full" />
        <p className="mt-3 text-sm text-muted">Not loaded yet.</p>
      </div>
    )
  }

  const safeMax = max > 0 ? max : 1
  const clamped = Math.min(safeMax, Math.max(0, value))
  const percent = Math.round((clamped / safeMax) * 100)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span>{label}</span>
        <span className="text-muted">{percent}%</span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-2xl bg-border"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
      >
        <div className="h-full rounded-2xl bg-accent transition-base" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
