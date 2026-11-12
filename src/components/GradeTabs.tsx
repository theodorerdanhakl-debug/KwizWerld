import { useEffect, useRef, type KeyboardEvent } from 'react'
import { GRADES, gradeLabel, type Grade } from '../data/content'
import { cn } from '../utils/cn'

export type GradeTabsProps = {
  value: Grade
  onChange: (grade: Grade) => void
}

export function GradeTabs({ value, onChange }: GradeTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const selectedIndex = GRADES.indexOf(value)

  useEffect(() => {
    const selected = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    selected?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [value])

  function move(nextIndex: number) {
    const grade = GRADES[nextIndex]
    if (!grade) return
    onChange(grade)
    const node = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex]
    node?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = selectedIndex === -1 ? 0 : selectedIndex
    let next = current
    if (event.key === 'ArrowRight') next = (current + 1) % GRADES.length
    else if (event.key === 'ArrowLeft') next = (current - 1 + GRADES.length) % GRADES.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = GRADES.length - 1
    else return
    event.preventDefault()
    move(next)
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Grade"
      className="grade-tabs"
      onKeyDown={onKeyDown}
    >
      {GRADES.map((grade, index) => {
        const selected = grade === value
        return (
          <button
            key={grade}
            type="button"
            role="tab"
            id={`grade-tab-${grade}`}
            className={cn('tab', selected && 'tab-selected')}
            aria-selected={selected}
            aria-label={gradeLabel(grade)}
            tabIndex={selected || (selectedIndex === -1 && index === 0) ? 0 : -1}
            onClick={() => onChange(grade)}
          >
            {grade}
          </button>
        )
      })}
    </div>
  )
}
