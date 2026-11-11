import { useId, type ReactNode } from 'react'

export type FieldProps = {
  label: string
  hint?: string
  error?: string | null
  children: (ids: { id: string; describedBy?: string }) => ReactNode
}

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter((value) => value !== undefined).join(' ')

  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children({ id, describedBy: describedBy.length > 0 ? describedBy : undefined })}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
