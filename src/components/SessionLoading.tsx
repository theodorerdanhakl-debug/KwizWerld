import { Skeleton } from './Skeleton'

export function SessionLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="w-full max-w-sm" aria-live="polite" aria-busy="true">
        <p className="sr-only">Loading your account.</p>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    </div>
  )
}
