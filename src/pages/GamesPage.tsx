import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GamePreview } from '../components/GamePreview'
import { PageLayout } from '../components/PageLayout'
import { Skeleton } from '../components/Skeleton'
import { getGames, gradeLabel, subjectName } from '../data/content'
import { GAME_DIAMOND_HINT, GAME_EXP_HINT, isArcadeId, playsLabel } from '../games/core/result'
import { useGameStatsStore } from '../store/gameStats'
import { loadGameStats } from '../supabase/gameStats'

function warmGame(): void {
  void import('../games/core/GameShell')
}

export function GamesPage() {
  const status = useGameStatsStore((state) => state.status)
  const byId = useGameStatsStore((state) => state.byId)
  const games = getGames()

  useEffect(() => {
    void loadGameStats()
  }, [])

  return (
    <PageLayout title="Games" lede="Short runs with a best to beat." width="full">
      {status === 'loading' ? <p className="sr-only">Loading scores.</p> : null}
      {status === 'offline' ? (
        <p className="mb-6 text-sm text-muted">Scores and rewards save when you're connected.</p>
      ) : null}
      {status === 'error' ? <p className="mb-6 text-sm text-muted">Scores didn't load.</p> : null}
      <ul className="game-grid">
        {games.map((game) => {
          const stat = isArcadeId(game.id) ? byId[game.id] : undefined
          return (
            <li key={game.id}>
              <Link
                to={`/games/${game.id}`}
                className="game-card"
                onMouseEnter={warmGame}
                onFocus={warmGame}
              >
                <div className="game-preview">
                  <GamePreview id={game.id} />
                </div>
                <div className="game-card-body">
                  <h2 className="text-2xl">{game.name}</h2>
                  <p className="text-sm text-muted">
                    {subjectName(game.subject)} · {gradeLabel(game.grade)}
                  </p>
                  <p className="text-muted">{game.summary}</p>
                  <div className="game-card-meta">
                    <p className="text-sm">
                      {status === 'loading' ? (
                        <Skeleton className="inline-block h-4 w-36" />
                      ) : stat ? (
                        `Best ${stat.bestScore} · ${playsLabel(stat.plays)}`
                      ) : status === 'ready' ? (
                        'No runs yet'
                      ) : (
                        '—'
                      )}
                    </p>
                    <p className="game-reward-hint">
                      <span className="text-muted">Rewards</span>
                      <span className="text-exp">{GAME_EXP_HINT}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-diamond">{GAME_DIAMOND_HINT}</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </PageLayout>
  )
}
