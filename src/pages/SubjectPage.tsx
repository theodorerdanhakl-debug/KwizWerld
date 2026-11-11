import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { Tabs } from '../components/Tabs'
import { getMode, getModes, getSubject } from '../data/content'

export function SubjectPage() {
  const params = useParams()
  const subjectId = params.subjectId ?? ''
  const modeId = params.mode
  const subject = getSubject(subjectId)

  if (!subject) {
    return (
      <PageLayout title="Subject" lede="That subject is not in KwizWerld yet.">
        <Button variant="primary" href="/home">
          Back to subjects
        </Button>
      </PageLayout>
    )
  }

  const mode = modeId ? getMode(modeId) : undefined
  const modes = getModes()

  return (
    <PageLayout title={subject.name} lede={subject.summary} subjectId={subject.id}>
      <Tabs
        label={`${subject.name} modes`}
        value={mode?.id ?? ''}
        tabs={modes.map((item) => ({
          id: item.id,
          label: item.label,
          href: `/subject/${subject.id}/${item.id}`,
        }))}
        panel={
          <p className="text-muted">
            {mode ? mode.summary : modeId ? 'That mode is not part of this subject.' : 'Choose learn, study, or practice.'}
          </p>
        }
      />
    </PageLayout>
  )
}
