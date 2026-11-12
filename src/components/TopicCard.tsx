import { Link } from 'react-router-dom'
import type { Topic } from '../data/curriculum'
import { masteryLabel, masteryValue, type Mastery } from '../utils/recommendations'
import { MasteryRing } from './MasteryRing'
import { TopicIcon } from './TopicIcon'

export type TopicCardProps = {
  topic: Topic
  href: string
  mastery?: Mastery
}

export function TopicCard({ topic, href, mastery = 'not-started' }: TopicCardProps) {
  return (
    <Link to={href} className="topic-card" data-mastery={mastery}>
      <span className="topic-card-top">
        <span className="topic-icon">
          <TopicIcon name={topic.icon} />
        </span>
        <span className="topic-card-status">
          <MasteryRing value={masteryValue(mastery)} />
          {mastery === 'not-started' ? (
            <span className="sr-only">{masteryLabel(mastery)}</span>
          ) : (
            <span className="topic-mastery">{masteryLabel(mastery)}</span>
          )}
        </span>
      </span>
      <h2 className="topic-card-title">{topic.name}</h2>
      <p className="topic-card-detail">{topic.description}</p>
    </Link>
  )
}
