import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { GradeTabs } from '../components/GradeTabs'
import { PageLayout } from '../components/PageLayout'
import { BackLink, SubjectShell } from '../components/SubjectShell'
import { TopicCard } from '../components/TopicCard'
import { getMode, getSubject, isGrade, type Grade } from '../data/content'
import { getTopics } from '../data/curriculum'
import { useProgressStore } from '../store/progress'
import { useSessionStore } from '../store/session'
import { masteryFor } from '../utils/recommendations'

export function ModePage() {
  const params = useParams()
  const subject = getSubject(params.subjectId ?? '')
  const mode = getMode(params.mode ?? '')
  const profileGrade = useSessionStore((state) => state.profile?.gradeLevel)
  const attempts = useProgressStore((state) => state.attempts)
  const [grade, setGrade] = useState<Grade>(profileGrade && isGrade(profileGrade) ? profileGrade : 'K')
  const [search, setSearch] = useState('')

  if (!subject) {
    return (
      <PageLayout title="Subject" lede="That subject is not in KwizWerld yet.">
        <Button variant="primary" href="/home">
          Back to subjects
        </Button>
      </PageLayout>
    )
  }

  if (!mode) {
    return (
      <SubjectShell title="Mode" subjectId={subject.id}>
        <h1 className="text-4xl font-semibold">Mode</h1>
        <p className="mt-4 text-lg text-muted">That mode is not part of this subject.</p>
        <div className="mt-8">
          <Button variant="primary" href={`/subject/${subject.id}`}>
            Back to {subject.name}
          </Button>
        </div>
      </SubjectShell>
    )
  }

  const query = search.trim().toLowerCase()
  const topics = getTopics(subject.id, grade).filter((item) => {
    if (!query) return true
    return item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  return (
    <SubjectShell title={`${mode.label} · ${subject.name}`} subjectId={subject.id} width="wide">
      <BackLink href={`/subject/${subject.id}`}>{subject.name}</BackLink>
      <h1 className="mt-8 text-4xl font-semibold">{mode.label}</h1>
      <div className="mt-10">
        <GradeTabs value={grade} onChange={setGrade} />
      </div>
      <div className="mt-8 max-w-md">
        <Field label="Search">
          {({ id, describedBy }) => (
            <input
              id={id}
              className="field-input"
              type="search"
              value={search}
              placeholder="Search this grade"
              autoComplete="off"
              aria-describedby={describedBy}
              onChange={(event) => setSearch(event.target.value)}
            />
          )}
        </Field>
      </div>
      {topics.length > 0 ? (
        <ul className="topic-grid">
          {topics.map((item) => (
            <li key={item.id}>
              <TopicCard
                topic={item}
                href={`/subject/${subject.id}/${mode.id}/${item.id}`}
                mastery={masteryFor(attempts.filter((attempt) => attempt.topicId === item.id))}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted">Nothing in this grade matches.</p>
      )}
    </SubjectShell>
  )
}
