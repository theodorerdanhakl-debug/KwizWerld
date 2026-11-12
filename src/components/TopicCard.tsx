import { Link } from 'react-router-dom'
import type { Topic } from '../data/curriculum'
import { MasteryRing } from './MasteryRing'
import { TopicIcon } from './TopicIcon'

export type TopicCardProps = {
  topic: Topic
  href: string
  mastery?: number
}

export function TopicCard({ topic, href, mastery = 0 }: TopicCardProps) {
  const started = mastery > 0

  return (
    <Link to={href} className="topic-card">
      <span className="topic-card-top">
        <span className="topic-icon">
          <TopicIcon name={topic.icon} />
        </span>
        <MasteryRing value={mastery} />
      </span>
      <h2 className="topic-card-title">{topic.name}</h2>
      <p className="topic-card-detail">{topic.description}</p>
      <span className="sr-only">{started ? 'In progress.' : 'Not started.'}</span>
    </Link>
  )
}
