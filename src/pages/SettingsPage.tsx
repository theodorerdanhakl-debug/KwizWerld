import { PageLayout } from '../components/PageLayout'
import { Tabs } from '../components/Tabs'
import { useTheme } from '../hooks/useTheme'
import { isThemePreference } from '../store/theme'

const themeTabs = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
] as const

export function SettingsPage() {
  const { preference, setPreference } = useTheme()

  return (
    <PageLayout title="Settings" lede="Choose a theme for this device. It is saved here.">
      <Tabs
        label="Theme"
        value={preference}
        onChange={(id) => {
          if (isThemePreference(id)) setPreference(id)
        }}
        tabs={themeTabs}
      />
    </PageLayout>
  )
}
