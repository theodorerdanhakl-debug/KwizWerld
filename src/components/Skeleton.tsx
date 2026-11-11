import { cn } from '../utils/cn'

export type SkeletonProps = {
  className?: string
  pulse?: boolean
}

export function Skeleton({ className, pulse = true }: SkeletonProps) {
  return <span className={cn('skeleton', pulse && 'skeleton-pulse', className)} aria-hidden="true" />
}
