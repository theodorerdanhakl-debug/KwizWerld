import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export type FadeInProps = {
  children: ReactNode
  className?: string
}

export function FadeIn({ children, className }: FadeInProps) {
  const reduce = usePrefersReducedMotion()
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  )
}
