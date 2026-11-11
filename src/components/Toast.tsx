import { useEffect } from 'react'
import { useToastStore } from '../store/toast'

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((toast) => window.setTimeout(() => dismiss(toast.id), 4200))
    return () => {
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [toasts, dismiss])

  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" role="region" aria-label="Notices">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" role="status">
          <p>{toast.text}</p>
          <button type="button" className="text-sm text-muted" onClick={() => dismiss(toast.id)}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}
