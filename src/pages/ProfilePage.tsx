import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { gradeLabel } from '../data/content'
import { useSessionStore } from '../store/session'
import { formatBalance } from '../utils/formatBalance'
import { levelProgress } from '../utils/level'

export function ProfilePage() {
  const profile = useSessionStore((state) => state.profile)
  const error = useSessionStore((state) => state.error)
  const refreshProfile = useSessionStore((state) => state.refreshProfile)

  if (!profile) {
    return (
      <PageLayout title="Profile" lede={error ?? 'Your profile is still loading.'}>
        <Button variant="primary" onClick={() => void refreshProfile()}>
          Try again
        </Button>
      </PageLayout>
    )
  }

  const progress = levelProgress(profile.exp)

  return (
    <PageLayout title="Profile" lede={`${gradeLabel(profile.gradeLevel)}. Level ${profile.level}.`}>
      <div className="flex items-center gap-4">
        <Avatar name={profile.username} size="md" />
        <h2 className="text-2xl">{profile.username}</h2>
      </div>
      <dl className="mt-12 grid max-w-sm gap-8">
        <div>
          <dt className="text-sm text-muted">EXP</dt>
          <dd className="mt-2 text-2xl">{formatBalance(profile.exp)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Diamonds</dt>
          <dd className="mt-2 text-2xl">{formatBalance(profile.diamonds)}</dd>
        </div>
      </dl>
      <p className="mt-8 text-muted">
        {progress.maxed
          ? `Level ${progress.level}.`
          : `${formatBalance(progress.current)} of ${formatBalance(progress.needed)} EXP to the next level.`}
      </p>
    </PageLayout>
  )
}
