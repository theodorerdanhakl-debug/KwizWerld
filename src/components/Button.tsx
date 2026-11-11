import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'

type Variant = 'primary' | 'quiet'

export type ButtonProps = {
  variant?: Variant
  href?: string
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

function classes(variant: Variant, className: string | undefined): string {
  return cn(
    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-base',
    'disabled:pointer-events-none disabled:opacity-50',
    variant === 'primary' ? 'btn-primary' : 'btn-quiet',
    className,
  )
}

export function Button({
  variant = 'quiet',
  className,
  children,
  href,
  type = 'button',
  ...rest
}: ButtonProps) {
  const styles = classes(variant, className)
  if (href) {
    return (
      <Link to={href} className={styles}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={styles} {...rest}>
      {children}
    </button>
  )
}
