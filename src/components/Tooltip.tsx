import { useId, type ReactNode } from 'react'

export type TooltipProps = {
  label: string
  children: ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  const id = useId()
  return (
    <span className="group relative inline-flex rounded-2xl outline-none" tabIndex={0} aria-describedby={id}>
      {children}
      <span id={id} role="tooltip" className="tooltip">
        {label}
      </span>
    </span>
  )
}
