import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { ModeCard } from '../components/ModeCard'
import { PageLayout } from '../components/PageLayout'
import { BackLink, SubjectShell } from '../components/SubjectShell'
import { getMode, getModes, getSubject, gradeLabel } from '../data/content'
import { getPlaceholderRecommendations } from '../data/recommendations'
import { useSessionStore } from '../store/session'

export function SubjectPage() {
  const params = useParams()
  const subject = getSubject(params.subjectId ?? '')
  const grade = useSessionStore((state) => state.profile?.gradeLevel)

  if (!subject) {
    return (
      <PageLayout title="Subject" lede="That subject is not in KwizWerld yet.">
        <Button variant="primary" href="/home">
          Back to subjects
        </Button>
      </PageLayout>
    )
  }

  const recommendations = getPlaceholderRecommendations(subject.id)

  return (
    <SubjectShell title={subject.name} subjectId={subject.id} width="wide">
      <header>
        <BackLink href="/home">Subjects</BackLink>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-semibold">{subject.name}</h1>
          {grade ? <Badge tone="accent">{gradeLabel(grade)}</Badge> : null}
        </div>
      </header>

      <section className="mt-16" aria-labelledby="recommended-heading">
        <h2 id="recommended-heading" className="text-sm font-medium text-muted">
          Recommended next
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {recommendations.map((item) => {
            const mode = getMode(item.mode)
            return (
              <li key={item.id}>
                <Link to={`/subject/${subject.id}/${item.mode}`} className="recommend-card">
                  <span className="text-sm text-muted">{mode?.label}</span>
                  <span className="mt-3 block font-display text-2xl">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
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
