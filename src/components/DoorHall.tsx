import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { Subject, SubjectId } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { SubjectDoor } from './SubjectDoor'
import { SubjectIcon } from './SubjectIcon'

export type DoorHallProps = {
  subjects: readonly Subject[]
}

type Walk = {
  id: SubjectId
  top: number
  left: number
  width: number
  height: number
  x: number
  y: number
}

export function DoorHall({ subjects }: DoorHallProps) {
  const navigate = useNavigate()
  const reduce = usePrefersReducedMotion()
  const [walk, setWalk] = useState<Walk | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  function onEnter(id: SubjectId, rect: DOMRect) {
    if (timer.current !== null) return
    if (reduce) {
      navigate(`/subject/${id}`)
      return
    }
    const x = window.innerWidth / 2 - (rect.left + rect.width / 2)
    const y = window.innerHeight / 2 - (rect.top + rect.height / 2)
    setWalk({ id, top: rect.top, left: rect.left, width: rect.width, height: rect.height, x, y })
    timer.current = window.setTimeout(() => {
      navigate(`/subject/${id}`)
    }, 320)
  }

  return (
    <>
      <div className="door-scroller">
        <ul className="door-row">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <SubjectDoor
                subject={subject}
                dimmed={walk !== null && walk.id !== subject.id}
                walking={walk?.id === subject.id}
                onEnter={onEnter}
              />
            </li>
          ))}
        </ul>
      </div>
      {walk ? <WalkThrough walk={walk} /> : null}
    </>
  )
}

export type WalkThroughProps = {
  walk: Walk
}

function WalkThrough({ walk }: WalkThroughProps) {
  return createPortal(
    <motion.div
      className="walk-door"
      data-subject={walk.id}
      aria-hidden="true"
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: walk.x, y: walk.y, scale: 5, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ top: walk.top, left: walk.left, width: walk.width, height: walk.height }}
    >
      <SubjectIcon id={walk.id} />
      <span className="door-handle" />
    </motion.div>,
    document.body,
  )
}
