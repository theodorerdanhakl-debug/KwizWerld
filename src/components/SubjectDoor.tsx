import { motion } from 'framer-motion'
import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Subject, SubjectId } from '../data/content'
import { useHoverCapable } from '../hooks/useHoverCapable'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cn } from '../utils/cn'
import { SubjectIcon } from './SubjectIcon'
import { SubjectScene } from './SubjectScene'

export type SubjectDoorProps = {
  subject: Subject
  dimmed: boolean
  walking: boolean
  onEnter: (id: SubjectId, rect: DOMRect) => void
}

const swing = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }

export function SubjectDoor({ subject, dimmed, walking, onEnter }: SubjectDoorProps) {
  const reduce = usePrefersReducedMotion()
  const hoverCapable = useHoverCapable()
  const stageRef = useRef<HTMLSpanElement>(null)
  const touched = useRef(false)
  const origin = useRef<{ x: number; y: number; type: string } | null>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touchedOpen, setTouchedOpen] = useState(false)
  const open = hovered || focused || touchedOpen

  function enter() {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    onEnter(subject.id, rect)
  }

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    origin.current = { x: event.clientX, y: event.clientY, type: event.pointerType }
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    const start = origin.current
    const distance = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : 0
    if (distance > 12) {
      event.preventDefault()
      return
    }
    const keyboard = event.detail === 0
    const touchLike = start?.type === 'touch' || (start?.type !== 'mouse' && start?.type !== 'pen' && !hoverCapable)
    if (!keyboard && touchLike && !touched.current) {
      event.preventDefault()
      touched.current = true
      setTouchedOpen(true)
      return
    }
    event.preventDefault()
    enter()
  }

  return (
    <motion.div
      className={cn('door-card', open && 'is-open', walking && 'is-walking')}
      animate={{ opacity: dimmed || walking ? 0 : 1 }}
      transition={reduce || walking ? { duration: 0 } : { duration: 0.24, ease: 'easeOut' }}
      onMouseEnter={() => {
        if (origin.current?.type === 'touch') return
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="door-lift"
        animate={{ y: open && !reduce && !walking ? -8 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.24, ease: 'easeOut' }}
      >
        <Link
          to={`/subject/${subject.id}`}
          className="door-link"
          data-subject={subject.id}
          aria-label={subject.name}
          aria-expanded={open}
          onPointerDown={onPointerDown}
          onClick={onClick}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            touched.current = false
            setTouchedOpen(false)
            setFocused(false)
          }}
        >
          <span ref={stageRef} className="door-stage">
            <SubjectScene id={subject.id} />
            <span className="door-hinge" aria-hidden="true" />
            <motion.span
              className={cn('door-panel', reduce && open && 'is-revealed')}
              style={{ transformOrigin: 'left center' }}
              animate={{ rotateY: reduce ? 0 : open ? -58 : 0 }}
              transition={reduce ? { duration: 0 } : swing}
            >
              <SubjectIcon id={subject.id} />
              <span className="door-handle" aria-hidden="true" />
            </motion.span>
          </span>
        </Link>
      </motion.div>
      {reduce ? (
        <p className={cn('door-label', open && 'is-shown')} aria-hidden="true">
          {subject.name}
        </p>
      ) : (
        <motion.p
          className="door-label"
          aria-hidden="true"
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 4 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          {subject.name}
        </motion.p>
      )}
    </motion.div>
  )
}
