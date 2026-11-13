import { Skeleton } from './Skeleton'

export function LeaderboardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="podium">
        <Skeleton className="h-40" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </div>
    </div>
  )
}
