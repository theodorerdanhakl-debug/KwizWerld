import { useEffect } from 'react'
import { Button } from '../../components/Button'
import type { RewardGrant } from '../../store/economy'
import type { RunStory } from './result'

export type RewardState = 'pending' | 'ready' | 'offline' | 'error'

export function GameOver({
  score,
  story,
  grant,
  rewardState,
  saveNote,
  onAgain,
}: {
  score: number
  story: RunStory | null
  grant: RewardGrant | null
  rewardState: RewardState
  saveNote: string | null
  onAgain: () => void
}) {
  useEffect(() => {
    document.getElementById('play-again')?.focus()
  }, [])

  return (
    <div className="game-over" role="dialog" aria-labelledby="game-over-title">
      <div className="game-over-card">
        <h2 id="game-over-title" className="text-sm text-muted">
          Score
        </h2>
        <p className="game-score">{score}</p>
        {story?.isNewBest ? <p className="game-best-banner">NEW BEST!</p> : null}
        {story && !story.isNewBest ? <p className="text-muted">Best {story.best}</p> : null}
        {!story ? <p className="text-muted">Best —</p> : null}
        {story?.nearMiss ? <p className="mt-2 text-muted">{story.nearMiss}</p> : null}
        <div className="game-reward-line" aria-live="polite">
          <RewardLine grant={grant} rewardState={rewardState} />
        </div>
        {saveNote ? <p className="text-sm text-muted">{saveNote}</p> : null}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button id="play-again" variant="primary" className="game-again" onClick={onAgain}>
            Play Again
            <span className="sr-only">, or press Enter</span>
          </Button>
          <Button variant="quiet" href="/games">
            Back to Games
          </Button>
        </div>
      </div>
    </div>
  )
}

function RewardLine({ grant, rewardState }: { grant: RewardGrant | null; rewardState: RewardState }) {
  if (rewardState === 'pending') return <p className="text-muted">Adding rewards…</p>
  if (rewardState === 'offline') return <p className="text-muted">Rewards save when you're connected.</p>
  if (rewardState === 'error' || !grant) return <p className="text-muted">Couldn't add rewards.</p>
  if (grant.exp === 0 && grant.diamonds === 0) {
    return <p className="text-muted">{grant.capped ? "That's the hour's rewards." : 'No rewards this run.'}</p>
  }
  return (
    <>
      <p className="game-rewards">
        {grant.exp > 0 ? <span className="text-exp">+{grant.exp} EXP</span> : null}
        {grant.diamonds > 0 ? (
          <span className="text-diamond">
            +{grant.diamonds} {grant.diamonds === 1 ? 'diamond' : 'diamonds'}
          </span>
        ) : null}
      </p>
      {grant.leveledUp ? <p className="text-sm text-muted">Level {grant.level}</p> : null}
    </>
  )
}
