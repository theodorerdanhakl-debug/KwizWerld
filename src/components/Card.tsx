import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type CardProps = {
  children: ReactNode
  padded?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export function Card({ children, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-soft',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
