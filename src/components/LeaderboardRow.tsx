import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { formatBalance } from '../utils/formatBalance'
import type { LeaderboardEntry } from '../utils/leaderboard'
import { cn } from '../utils/cn'
import { ProfileChip } from './ProfileChip'

export type LeaderboardRowProps = {
  entry: LeaderboardEntry
  index?: number
  you?: boolean
  pinned?: boolean
}

export function LeaderboardRow({ entry, index = 0, you = false, pinned = false }: LeaderboardRowProps) {
  const reduce = usePrefersReducedMotion()
  const delay = reduce ? 0 : Math.min(index, 8) * 0.04

  return (
    <motion.li
      className={cn('leaderboard-row', you && 'is-viewer', pinned && 'is-pinned')}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay, ease: 'easeOut' }}
    >
      <span className="leaderboard-rank">{entry.rank}</span>
      <span className="leaderboard-player">
        <ProfileChip username={entry.username} cosmetics={entry.cosmetics} />
        {you ? <span className="leaderboard-you">You</span> : null}
      </span>
      <span className="leaderboard-exp">
        {formatBalance(entry.exp)}
        <span className="sr-only"> EXP</span>
      </span>
    </motion.li>
  )
}
