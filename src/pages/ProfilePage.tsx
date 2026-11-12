import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { SUBJECT_IDS, getSubject, gradeLabel } from '../data/content'
import { getTopics } from '../data/curriculum'
import { useProgressStore } from '../store/progress'
import { useSessionStore } from '../store/session'
import { formatBalance } from '../utils/formatBalance'
import { levelProgress } from '../utils/level'
import { progressBySubject, progressLine } from '../utils/recommendations'

export function ProfilePage() {
  const profile = useSessionStore((state) => state.profile)
  const error = useSessionStore((state) => state.error)
  const refreshProfile = useSessionStore((state) => state.refreshProfile)
  const attempts = useProgressStore((state) => state.attempts)
  const loaded = useProgressStore((state) => state.loaded)

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
  const overview = progressBySubject(
    attempts,
    SUBJECT_IDS.flatMap((subjectId) => getTopics(subjectId)),
  )

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
      <section className="mt-16" aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="text-sm font-medium text-muted">
          Progress
        </h2>
        {loaded ? (
          <ul className="progress-list">
            {overview.map((row) => (
              <li key={row.subjectId} className="progress-row">
                <span>{getSubject(row.subjectId)?.name}</span>
                <span className="text-muted">{progressLine(row)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-muted">Loading progress.</p>
        )}
      </section>
    </PageLayout>
  )
}
