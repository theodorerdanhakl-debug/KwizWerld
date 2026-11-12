import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { SubjectId } from '../data/content'
import { cn } from '../utils/cn'
import { FadeIn } from './FadeIn'
import { TopNav } from './TopNav'

export type BackLinkProps = {
  href: string
  children: ReactNode
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link to={href} className="subject-back">
      <svg viewBox="0 0 16 16" className="subject-back-icon" aria-hidden="true">
        <path d="M10 3 5 8l5 5" />
      </svg>
      {children}
    </Link>
  )
}

export type SubjectShellProps = {
  title: string
  subjectId?: SubjectId
  width?: 'narrow' | 'wide'
  children: ReactNode
}

export function SubjectShell({ title, subjectId, width = 'narrow', children }: SubjectShellProps) {
  useEffect(() => {
    document.title = `${title} · KwizWerld!`
  }, [title])

  return (
    <div className="min-h-dvh bg-background text-text" {...(subjectId ? { 'data-subject': subjectId } : {})}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <TopNav />
      <main
        id="content"
        tabIndex={-1}
        className={cn(
          'mx-auto w-full px-6 py-16 outline-none',
          width === 'wide' ? 'max-w-5xl' : 'max-w-xl',
        )}
      >
        <FadeIn>{children}</FadeIn>
      </main>
    </div>
  )
}
