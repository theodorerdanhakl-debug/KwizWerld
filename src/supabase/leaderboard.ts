import { useLeaderboardStore } from '../store/leaderboard'
import { parseLeaderboard, type LeaderboardWindow } from '../utils/leaderboard'
import { getSupabase } from './client'

const requestToken: Record<LeaderboardWindow, number> = { day: 0, week: 0, all: 0 }

export async function loadLeaderboard(board: LeaderboardWindow): Promise<void> {
  const token = ++requestToken[board]
  useLeaderboardStore.getState().begin(board)
  const supabase = getSupabase()
  if (!supabase) {
    if (token !== requestToken[board]) return
    useLeaderboardStore.getState().fail(board, 'Supabase is not configured for this app yet.')
    return
  }
  const { data, error } = await supabase.rpc('leaderboard', { board })
  if (token !== requestToken[board]) return
  const message = useLeaderboardStore.getState().slots[board].board
    ? "Couldn't refresh."
    : "The leaderboard didn't load."
  if (error) {
    useLeaderboardStore.getState().fail(board, message)
    return
  }
  const parsed = parseLeaderboard(data, board)
  if (!parsed) {
    useLeaderboardStore.getState().fail(board, message)
    return
  }
  useLeaderboardStore.getState().succeed(parsed)
}
