import { useRef } from 'react'
import { useSessionStore } from '../store/session'
import { isThemePreference, useThemeStore } from '../store/theme'
import { useToastStore } from '../store/toast'
import { SettingsSection } from './SettingsSection'
import { Tabs } from './Tabs'

const themeTabs = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
] as const

export function AppearanceSettings() {
  const preference = useThemeStore((state) => state.preference)
  const request = useRef(0)

  function onChange(id: string) {
    if (!isThemePreference(id)) return
    const previous = useThemeStore.getState().preference
    if (id === previous) return
    const current = ++request.current
    useThemeStore.getState().setPreference(id)
    void useSessionStore.getState().saveProfile({ theme: id }).then((result) => {
      if (current !== request.current) return
      if (!result.ok) {
        useThemeStore.getState().setPreference(previous)
        useToastStore.getState().push(result.message)
      }
    })
  }

  return (
    <SettingsSection title="Appearance" lede="Light, dark, or match this device.">
      <Tabs label="Theme" value={preference} onChange={onChange} tabs={themeTabs} />
    </SettingsSection>
  )
}
