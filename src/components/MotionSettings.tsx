import { useState } from 'react'
import { applyReducedMotion, usePreferencesStore } from '../store/preferences'
import { useSessionStore } from '../store/session'
import { useToastStore } from '../store/toast'
import { SettingsSection } from './SettingsSection'
import { Switch } from './Switch'

export function MotionSettings() {
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion)
  const [pending, setPending] = useState(false)

  async function onChange(next: boolean) {
    const profile = useSessionStore.getState().profile
    if (!profile || pending) return
    const previous = profile.reducedMotion
    applyReducedMotion(next)
    setPending(true)
    const result = await useSessionStore.getState().saveProfile({ reducedMotion: next })
    setPending(false)
    if (!result.ok) {
      applyReducedMotion(previous)
      useToastStore.getState().push(result.message)
    }
  }

  return (
    <SettingsSection
      title="Motion"
      lede="Turn this on to keep motion still. Your device setting still applies when this is off."
    >
      <div className="max-w-md">
        <Switch
          label="Reduced motion"
          checked={reducedMotion}
          disabled={pending}
          onChange={(checked) => void onChange(checked)}
        />
      </div>
    </SettingsSection>
  )
}
