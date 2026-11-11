import { useState } from 'react'
import { useSessionStore } from '../store/session'
import { applySoundPreferences, usePreferencesStore } from '../store/preferences'
import { useToastStore } from '../store/toast'
import { SettingsSection } from './SettingsSection'
import { Switch } from './Switch'

export function SoundSettings() {
  const soundEffects = usePreferencesStore((state) => state.soundEffects)
  const music = usePreferencesStore((state) => state.music)
  const [pending, setPending] = useState<'sound' | 'music' | null>(null)

  async function save(kind: 'sound' | 'music', next: boolean) {
    const profile = useSessionStore.getState().profile
    if (!profile || pending) return
    const previousSound = profile.soundEffects
    const previousMusic = profile.music
    const patch = kind === 'sound' ? { soundEffects: next } : { music: next }
    applySoundPreferences(
      kind === 'sound' ? next : previousSound,
      kind === 'music' ? next : previousMusic,
    )
    setPending(kind)
    const result = await useSessionStore.getState().saveProfile(patch)
    setPending(null)
    if (!result.ok) {
      applySoundPreferences(previousSound, previousMusic)
      useToastStore.getState().push(result.message)
    }
  }

  return (
    <SettingsSection title="Sound" lede="Sound effects and music stay off until a game uses them.">
      <div className="flex max-w-md flex-col gap-6">
        <Switch
          label="Sound effects"
          checked={soundEffects}
          disabled={pending !== null}
          onChange={(checked) => void save('sound', checked)}
        />
        <Switch
          label="Music"
          checked={music}
          disabled={pending !== null}
          onChange={(checked) => void save('music', checked)}
        />
      </div>
    </SettingsSection>
  )
}
