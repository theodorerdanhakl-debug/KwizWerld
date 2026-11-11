import { useEffect, type ReactNode } from 'react'
import type { SubjectId } from '../data/content'
import { FadeIn } from './FadeIn'
import { TopNav } from './TopNav'

export type PageLayoutProps = {
  title: string
  lede: string
  subjectId?: SubjectId
  children?: ReactNode
}

export function PageLayout({ title, lede, subjectId, children }: PageLayoutProps) {
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
      <main id="content" tabIndex={-1} className="mx-auto w-full max-w-xl px-6 py-16 outline-none">
        <FadeIn>
          <h1 className="text-balance text-4xl font-semibold">{title}</h1>
          <p className="mt-4 text-pretty text-lg text-muted">{lede}</p>
          {children !== undefined ? <div className="mt-10">{children}</div> : null}
        </FadeIn>
      </main>
    </div>
  )
}
