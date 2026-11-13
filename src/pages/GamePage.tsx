import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'
import { TopNav } from '../components/TopNav'
import { getArcade } from '../data/arcade'
import { getGame, gradeLabel, subjectName } from '../data/content'

const GameShell = lazy(() => import('../games/core/GameShell'))

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

  const spec = getArcade(game.id)
  if (!spec) {
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

  return (
    <Suspense fallback={<Opening name={game.name} subject={game.subject} />}>
      <GameShell key={game.id} game={game} spec={spec} />
    </Suspense>
  )
}

function Opening({ name, subject }: { name: string; subject: string }) {
  return (
    <div className="min-h-dvh bg-background text-text" data-subject={subject}>
      <TopNav />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div className="game-stage" />
      </main>
    </div>
  )
}
