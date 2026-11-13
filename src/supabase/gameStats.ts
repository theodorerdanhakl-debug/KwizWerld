import { useGameStatsStore } from '../store/gameStats'
import { getSupabase } from './client'
import { describeRun, isArcadeId, parseGameRun, parseGameStat, type ParsedRun } from '../games/core/result'

export type RecordedRun = ParsedRun & {
  persisted: boolean
}

let loadGeneration = 0

export async function loadGameStats(): Promise<void> {
  const generation = ++loadGeneration
  const supabase = getSupabase()
  if (!supabase) {
    if (generation !== loadGeneration) return
    useGameStatsStore.getState().markOffline()
    return
  }
  const { data, error } = await supabase.from('game_stats').select('game_id, best_score, plays')
  if (generation !== loadGeneration) return
  if (error) {
    useGameStatsStore.getState().fail()
    return
  }
  const stats = (data ?? []).flatMap((row) => {
    const stat = parseGameStat(row)
    return stat ? [stat] : []
  })
  useGameStatsStore.getState().replace(stats)
}

export function clearGameStats(): void {
  loadGeneration += 1
  useGameStatsStore.getState().reset()
}

export async function recordGameRun(gameId: string, score: number): Promise<RecordedRun | null> {
  if (!isArcadeId(gameId)) return null
  const supabase = getSupabase()
  if (!supabase) {
    const current = useGameStatsStore.getState().byId[gameId]
    const story = describeRun(score, current?.bestScore ?? null)
    const plays = (current?.plays ?? 0) + 1
    useGameStatsStore.getState().remember({ gameId, bestScore: story.best, plays })
    return { gameId, plays, story, persisted: false }
  }
  const { data, error } = await supabase.rpc('record_game_run', {
    game_id: gameId,
    score,
  })
  if (error) return null
  const parsed = parseGameRun(data)
  if (!parsed || parsed.gameId !== gameId) return null
  useGameStatsStore.getState().remember({
    gameId: parsed.gameId,
    bestScore: parsed.story.best,
    plays: parsed.plays,
  })
  return { ...parsed, persisted: true }
}
