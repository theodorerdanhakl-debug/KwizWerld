import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageLayout } from '../components/PageLayout'
import { getGames, gradeLabel, subjectName } from '../data/content'

export function GamesPage() {
  const games = getGames()

  return (
    <PageLayout title="Games" lede="Arcade practice will open here.">
      <ul className="flex flex-col gap-5">
        {games.map((game) => (
          <li key={game.id}>
            <Card padded={false} className="transition-base hover:bg-surface-elevated">
              <Link to={`/games/${game.id}`} className="block p-6">
                <h2 className="text-2xl">{game.name}</h2>
                <p className="mt-2 text-sm text-muted">
                  {subjectName(game.subject)} · {gradeLabel(game.grade)}
                </p>
                <p className="mt-3 text-muted">{game.summary}</p>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
