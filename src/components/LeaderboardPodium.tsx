import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { formatBalance } from '../utils/formatBalance'
import type { LeaderboardEntry } from '../utils/leaderboard'
import { cn } from '../utils/cn'
import { ProfileChip } from './ProfileChip'

export type LeaderboardPodiumProps = {
  entries: readonly LeaderboardEntry[]
  viewerId: string | null
}

const places = ['podium-first', 'podium-second', 'podium-third'] as const

export function LeaderboardPodium({ entries, viewerId }: LeaderboardPodiumProps) {
  const reduce = usePrefersReducedMotion()
  const spots = entries.slice(0, 3)

  return (
    <ol className="podium">
      {spots.map((entry, index) => (
        <motion.li
          key={entry.userId}
          className={cn('podium-card', places[index])}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: reduce ? 0 : index * 0.05, ease: 'easeOut' }}
        >
          <p className="podium-rank">{entry.rank}</p>
          <ProfileChip username={entry.username} cosmetics={entry.cosmetics} size={index === 0 ? 'md' : 'sm'} />
          <p className="podium-exp">
            {formatBalance(entry.exp)}
            <span className="sr-only"> EXP</span>
          </p>
          {entry.userId === viewerId ? <p className="text-sm text-muted">You</p> : null}
        </motion.li>
      ))}
    </ol>
  )
}
