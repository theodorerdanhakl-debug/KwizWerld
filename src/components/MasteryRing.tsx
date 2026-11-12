export type MasteryRingProps = {
  value: number
}

const radius = 15
const circumference = 2 * Math.PI * radius

export function MasteryRing({ value }: MasteryRingProps) {
  const clamped = Math.min(1, Math.max(0, value))

  return (
    <svg className="mastery-ring" viewBox="0 0 36 36" aria-hidden="true">
      <circle className="mastery-track" cx="18" cy="18" r={radius} />
      <circle
        className="mastery-value"
        cx="18"
        cy="18"
        r={radius}
        strokeDasharray={`${clamped * circumference} ${circumference}`}
        transform="rotate(-90 18 18)"
      />
    </svg>
  )
}
