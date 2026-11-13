import { useEffect, type ReactNode } from 'react'
import type { SubjectId } from '../data/content'
import { cn } from '../utils/cn'
import { FadeIn } from './FadeIn'
import { TopNav } from './TopNav'

export type PageLayoutProps = {
  title: string
  lede: string
  subjectId?: SubjectId
  width?: 'default' | 'wide' | 'full'
  children?: ReactNode
}

export function PageLayout({ title, lede, subjectId, width = 'default', children }: PageLayoutProps) {
  useEffect(() => {
    document.title = `${title} · KwizWerld!`
  }, [title])

  return (
    <div
      className="min-h-dvh bg-background text-text"
      {...(subjectId ? { 'data-subject': subjectId } : {})}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <TopNav />
      <main
        id="content"
        tabIndex={-1}
        className={cn(
          'mx-auto w-full px-6 py-16 outline-none',
          width === 'full' ? 'max-w-5xl' : width === 'wide' ? 'max-w-3xl' : 'max-w-xl',
        )}
      >
        <FadeIn>
          <h1 className="text-balance text-4xl font-semibold">{title}</h1>
          <p className="mt-4 text-pretty text-lg text-muted">{lede}</p>
          {children !== undefined ? <div className="mt-10">{children}</div> : null}
        </FadeIn>
      </main>
    </div>
  )
}
