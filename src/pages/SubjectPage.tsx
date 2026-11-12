import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { ModeCard } from '../components/ModeCard'
import { PageLayout } from '../components/PageLayout'
import { BackLink, SubjectShell } from '../components/SubjectShell'
import { getMode, getModes, getSubject, gradeLabel } from '../data/content'
import { getTopics } from '../data/curriculum'
import { useProgressStore } from '../store/progress'
import { useSessionStore } from '../store/session'
import { recommendNext } from '../utils/recommendations'

export function SubjectPage() {
  const params = useParams()
  const subject = getSubject(params.subjectId ?? '')
  const profileGrade = useSessionStore((state) => state.profile?.gradeLevel)
  const grade = profileGrade ?? 'K'
  const attempts = useProgressStore((state) => state.attempts)
  const loaded = useProgressStore((state) => state.loaded)

  if (!subject) {
    return (
      <PageLayout title="Subject" lede="That subject is not in KwizWerld yet.">
        <Button variant="primary" href="/home">
          Back to subjects
        </Button>
      </PageLayout>
    )
  }

  const recommendations = recommendNext({
    subjectId: subject.id,
    grade,
    attempts,
    topics: getTopics(subject.id),
  })

  return (
    <SubjectShell title={subject.name} subjectId={subject.id} width="wide">
      <header>
        <BackLink href="/home">Subjects</BackLink>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-semibold">{subject.name}</h1>
          {profileGrade ? <Badge tone="accent">{gradeLabel(profileGrade)}</Badge> : null}
        </div>
      </header>

      <section className="mt-16" aria-labelledby="recommended-heading">
        <h2 id="recommended-heading" className="text-sm font-medium text-muted">
          Recommended next
        </h2>
        {loaded ? (
          recommendations.length > 0 ? (
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {recommendations.map((item) => {
                const mode = getMode(item.mode)
                return (
                  <li key={`${item.kind}-${item.topicId}`}>
                    <Link
                      to={`/subject/${subject.id}/${item.mode}/${item.topicId}`}
                      className="recommend-card"
                      data-kind={item.kind}
                    >
                      <span className="text-sm text-muted">{mode?.label}</span>
                      <span className="mt-3 block font-display text-2xl">{item.title}</span>
                      <span className="recommend-reason">{item.reason}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-5 text-muted">Nothing to suggest yet.</p>
          )
        ) : (
          <p className="mt-5 text-muted">Loading recommendations.</p>
        )}
      </section>

      <section className="mt-20" aria-label="Modes">
        <ul className="grid gap-5 md:grid-cols-3">
          {getModes().map((mode) => (
            <li key={mode.id}>
              <ModeCard mode={mode} href={`/subject/${subject.id}/${mode.id}`} />
            </li>
          ))}
        </ul>
      </section>
    </SubjectShell>
  )
}
