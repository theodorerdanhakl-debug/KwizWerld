import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { Card } from './Card'
import { FadeIn } from './FadeIn'

export type AuthLink = {
  href: string
  label: string
}

export type AuthLayoutProps = {
  title: string
  lede: string
  primary: AuthLink
  quiet: AuthLink
}

export function AuthLayout({ title, lede, primary, quiet }: AuthLayoutProps) {
  useEffect(() => {
    document.title = `${title} · KwizWerld!`
  }, [title])

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 py-16 text-text">
      <FadeIn className="w-full max-w-md">
        <Link to="/home" className="font-display text-2xl font-semibold">
          KwizWerld!
        </Link>
        <Card className="mt-8">
          <h1 className="text-balance text-4xl font-semibold">{title}</h1>
          <p className="mt-4 text-pretty text-lg text-muted">{lede}</p>
          <div className="mt-8">
            <Button variant="primary" href={primary.href} className="w-full">
              {primary.label}
            </Button>
          </div>
          <p className="mt-4 text-center">
            <Button href={quiet.href}>{quiet.label}</Button>
          </p>
        </Card>
      </FadeIn>
    </div>
  )
}
