import { useId } from 'react'
import { cn } from '../utils/cn'

export type SwitchProps = {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Switch({ checked, label, onChange, disabled = false }: SwitchProps) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-6">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        className={cn('switch', checked && 'switch-on')}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  )
}
