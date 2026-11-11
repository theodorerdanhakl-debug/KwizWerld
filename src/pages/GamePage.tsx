import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { getGame, gradeLabel, subjectName } from '../data/content'

export function GamePage() {
  const params = useParams()
  const game = getGame(params.gameId ?? '')

  if (!game) {
    return (
      <PageLayout title="Game" lede="That game is not in KwizWerld yet.">
        <Button variant="primary" href="/games">
          Back to games
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={game.name} lede={game.summary} subjectId={game.subject}>
      <p className="text-sm text-muted">
        {subjectName(game.subject)} · {gradeLabel(game.grade)}
      </p>
      <p className="mt-4 text-muted">This arcade game is not open yet.</p>
      <div className="mt-8">
        <Button variant="primary" href="/games">
          Back to games
        </Button>
      </div>
    </PageLayout>
  )
}
