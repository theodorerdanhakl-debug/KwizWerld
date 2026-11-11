import { useEffect, type ReactNode } from 'react'
import { Card } from './Card'
import { FadeIn } from './FadeIn'

export type AuthLayoutProps = {
  title: string
  lede: string
  children: ReactNode
}

export function AuthLayout({ title, lede, children }: AuthLayoutProps) {
  useEffect(() => {
    document.title = `${title} · KwizWerld!`
  }, [title])

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 py-16 text-text">
      <FadeIn className="w-full max-w-md">
        <p className="font-display text-2xl font-semibold">KwizWerld!</p>
        <Card className="mt-8">
          <h1 className="text-balance text-4xl font-semibold">{title}</h1>
          <p className="mt-4 text-pretty text-lg text-muted">{lede}</p>
          <div className="mt-8">{children}</div>
        </Card>
      </FadeIn>
    </div>
  )
}
