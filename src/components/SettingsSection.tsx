import type { ReactNode } from 'react'

export type SettingsSectionProps = {
  title: string
  lede: string
  children: ReactNode
}

export function SettingsSection({ title, lede, children }: SettingsSectionProps) {
  return (
    <section className="mt-16 first:mt-0">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-3 max-w-md text-pretty text-muted">{lede}</p>
      <div className="mt-8">{children}</div>
    </section>
  )
}
