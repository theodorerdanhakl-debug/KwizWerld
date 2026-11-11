import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'

export type TabItem = {
  id: string
  label: string
  href?: string
}

export type TabsProps = {
  label: string
  tabs: readonly TabItem[]
  value: string
  onChange?: (id: string) => void
  panel?: ReactNode
}

export function Tabs({ label, tabs, value, onChange, panel }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const panelId = useId()
  const selectedIndex = tabs.findIndex((tab) => tab.id === value)
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex

  function move(nextIndex: number) {
    const tab = tabs[nextIndex]
    if (!tab) return
    if (tab.href) navigate(tab.href)
    else onChange?.(tab.id)
    const node = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex]
    node?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (tabs.length === 0) return
    const current = selectedIndex === -1 ? 0 : selectedIndex
    let next = current
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    move(next)
  }

  return (
    <div>
      <div ref={listRef} role="tablist" aria-label={label} className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => {
          const selected = tab.id === value
          const className = cn('tab transition-base', selected && 'tab-selected')
          const shared = {
            id: `tab-${tab.id}`,
            role: 'tab' as const,
            'aria-selected': selected,
            tabIndex: index === tabbableIndex ? 0 : -1,
            className,
          }
          if (tab.href) {
            return (
              <Link key={tab.id} to={tab.href} {...shared}>
                {tab.label}
              </Link>
            )
          }
          return (
            <button key={tab.id} type="button" {...shared} onClick={() => onChange?.(tab.id)}>
              {tab.label}
            </button>
          )
        })}
      </div>
      {panel !== undefined ? (
        <div role="tabpanel" id={panelId} aria-labelledby={selectedIndex === -1 ? undefined : `tab-${value}`} className="mt-6">
          {panel}
        </div>
      ) : null}
    </div>
  )
}
