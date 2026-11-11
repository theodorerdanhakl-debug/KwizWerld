import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageLayout } from '../components/PageLayout'
import { getSubjects } from '../data/content'

export function HomePage() {
  const subjects = getSubjects()

  return (
    <PageLayout title="Pick a subject" lede="Learn it, study it, then practice.">
      <ul className="flex flex-col gap-5">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Card padded={false} className="transition-base hover:bg-surface-elevated">
              <Link to={`/subject/${subject.id}`} className="block p-6">
                <h2 className="text-2xl">{subject.name}</h2>
                <p className="mt-2 text-muted">{subject.summary}</p>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
