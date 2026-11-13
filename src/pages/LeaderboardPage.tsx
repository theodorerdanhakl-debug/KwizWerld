import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { LeaderboardPodium } from '../components/LeaderboardPodium'
import { LeaderboardRow } from '../components/LeaderboardRow'
import { LeaderboardSkeleton } from '../components/LeaderboardSkeleton'
import { PageLayout } from '../components/PageLayout'
import { ResetCountdown } from '../components/ResetCountdown'
import { Tabs } from '../components/Tabs'
import { useLeaderboardStore } from '../store/leaderboard'
import { loadLeaderboard } from '../supabase/leaderboard'
import { isLeaderboardWindow, showPinnedViewer, type LeaderboardWindow } from '../utils/leaderboard'

const REFRESH_MS = 60_000

const tabs = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'all', label: 'All-Time' },
] as const

function emptyCopy(board: LeaderboardWindow): string {
  if (board === 'day') return 'No EXP earned yet today.'
  if (board === 'week') return 'No EXP earned yet this week.'
  return 'No one has EXP yet.'
}

export function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardWindow>('day')
  const slot = useLeaderboardStore((state) => state.slots[period])
  const refresh = useCallback(() => {
    void loadLeaderboard(period)
  }, [period])

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [refresh])

  const board = slot.board
  const viewerId = board?.viewer?.userId ?? null
  const pinned = board ? showPinnedViewer(board.entries, board.viewer) : false
  const rest = board?.entries.slice(3) ?? []

  return (
    <PageLayout title="Leaderboard" lede="The top 100 by EXP." width="wide">
      <Tabs
        label="Leaderboard window"
        tabs={tabs}
        value={period}
        onChange={(id) => {
          if (isLeaderboardWindow(id)) setPeriod(id)
        }}
        panel={
          <>
            {board?.resetsAt ? <ResetCountdown resetsAt={board.resetsAt} onElapsed={refresh} /> : null}
            {slot.error && board ? <p className="mt-4 text-sm text-muted">{slot.error}</p> : null}
            {!board && (slot.phase === 'idle' || slot.phase === 'loading') ? (
              <>
                <p className="sr-only">Loading the leaderboard.</p>
                <LeaderboardSkeleton />
              </>
            ) : null}
            {!board && slot.phase === 'error' ? (
              <div>
                <p className="text-muted">{slot.error ?? "The leaderboard didn't load."}</p>
                <div className="mt-8">
                  <Button variant="primary" onClick={refresh}>
                    Try again
                  </Button>
                </div>
              </div>
            ) : null}
            {board && board.entries.length === 0 ? <p className="text-muted">{emptyCopy(period)}</p> : null}
            {board && board.entries.length > 0 ? (
              <>
                <LeaderboardPodium entries={board.entries} viewerId={viewerId} />
                {rest.length > 0 ? (
                  <ol className="leaderboard-list">
                    {rest.map((entry, index) => (
                      <LeaderboardRow
                        key={entry.userId}
                        entry={entry}
                        index={index}
                        you={entry.userId === viewerId}
                      />
                    ))}
                  </ol>
                ) : null}
              </>
            ) : null}
            {board && pinned && board.viewer ? (
              <>
                <div className="leaderboard-pin-space" />
                <div className="leaderboard-pin">
                  <p className="sr-only">Your rank</p>
                  <ol className="leaderboard-pin-list">
                    <LeaderboardRow entry={board.viewer} you pinned />
                  </ol>
                </div>
              </>
            ) : null}
          </>
        }
      />
    </PageLayout>
  )
}
