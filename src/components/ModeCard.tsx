import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Mode } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ModeIcon } from './ModeIcon'

export type ModeCardProps = {
  mode: Mode
  href: string
}

export function ModeCard({ mode, href }: ModeCardProps) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.div
      className="h-full"
      whileHover={reduce ? undefined : { y: -8 }}
      whileFocus={reduce ? undefined : { y: -8 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <Link to={href} className="mode-card">
        <span className="mode-icon">
          <ModeIcon id={mode.id} />
        </span>
        <h2 className="mode-card-title">{mode.label}</h2>
        <p className="mode-card-detail">{mode.summary}</p>
      </Link>
    </motion.div>
  )
}
