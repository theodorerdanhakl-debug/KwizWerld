import { AppearanceSettings } from '../components/AppearanceSettings'
import { Button } from '../components/Button'
import { DeleteAccount } from '../components/DeleteAccount'
import { GradeSettings } from '../components/GradeSettings'
import { MotionSettings } from '../components/MotionSettings'
import { PageLayout } from '../components/PageLayout'
import { SoundSettings } from '../components/SoundSettings'
import { UsernameSettings } from '../components/UsernameSettings'
import { useSessionStore } from '../store/session'

export function SettingsPage() {
  const profile = useSessionStore((state) => state.profile)
  const error = useSessionStore((state) => state.error)
  const refreshProfile = useSessionStore((state) => state.refreshProfile)

  if (!profile) {
    return (
      <PageLayout title="Settings" lede={error ?? 'Your profile is still loading.'}>
        <Button variant="primary" onClick={() => void refreshProfile()}>
          Try again
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Settings" lede="Tune how KwizWerld looks and sounds.">
      <AppearanceSettings />
      <SoundSettings />
      <MotionSettings />
      <GradeSettings />
      <UsernameSettings />
      <DeleteAccount />
    </PageLayout>
  )
}
