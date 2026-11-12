import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { BackLink, SubjectShell } from '../components/SubjectShell'
import { getActivity } from '../data/activities'
import { getMode, getSubject } from '../data/content'
import { getTopic } from '../data/curriculum'
import { LearnSession } from '../sessions/LearnSession'
import { PracticeSession } from '../sessions/PracticeSession'
import { StudySession } from '../sessions/StudySession'

export function TopicPage() {
  const params = useParams()
  const subject = getSubject(params.subjectId ?? '')
  const mode = getMode(params.mode ?? '')
  const topic = getTopic(params.topicId ?? '')
  const matches = topic !== undefined && subject !== undefined && topic.subjectId === subject.id

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

  if (!matches || !topic) {
    return (
      <SubjectShell title="Topic" subjectId={subject.id}>
        <h1 className="text-4xl font-semibold">Topic</h1>
        <p className="mt-4 text-lg text-muted">That topic is not in this subject.</p>
        <div className="mt-8">
          <Button variant="primary" href={`/subject/${subject.id}/${mode.id}`}>
            Back to {mode.label}
          </Button>
        </div>
      </SubjectShell>
    )
  }

  const activity = getActivity(topic.id)
  const backHref = `/subject/${subject.id}/${mode.id}`

  return (
    <SubjectShell title={`${topic.name} · ${mode.label}`} subjectId={subject.id}>
      <BackLink href={backHref}>{mode.label}</BackLink>
      <h1 className="mt-8 text-4xl font-semibold">{topic.name}</h1>
      <div className="mt-10">
        {!activity ? (
          <div>
            <p className="text-lg text-muted">This activity is not ready yet.</p>
            <div className="mt-8">
              <Button variant="primary" href={backHref}>
                Back to {mode.label}
              </Button>
            </div>
          </div>
        ) : mode.id === 'learn' ? (
          <LearnSession activity={activity} backHref={backHref} />
        ) : mode.id === 'study' ? (
          <StudySession activity={activity} backHref={backHref} />
        ) : (
          <PracticeSession activity={activity} backHref={backHref} />
        )}
      </div>
    </SubjectShell>
  )
}
