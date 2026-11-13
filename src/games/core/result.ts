// Pure run summary. The server still decides the stored best and the rewards.

export const ARCADE_IDS = ['sum-sprint', 'word-trail', 'map-hop', 'lab-notes', 'time-post'] as const
export type ArcadeId = (typeof ARCADE_IDS)[number]

export const RUN_MS = 20_000
export const MISS_LIMIT = 3
export const NEAR_MISS_GAP = 5

/** Display copy for the server maximum. A run never grants this on the client. */
export const GAME_EXP_HINT = 'Up to 100 EXP'
export const GAME_DIAMOND_HINT = '2 diamonds'

export type RunStory = {
  score: number
  previousBest: number | null
  best: number
  isNewBest: boolean
  nearMiss: string | null
}

export type GameStat = {
  gameId: ArcadeId
  bestScore: number
  plays: number
}

export type ParsedRun = {
  gameId: ArcadeId
  plays: number
  story: RunStory
}

export function isArcadeId(value: string): value is ArcadeId {
  return ARCADE_IDS.some((id) => id === value)
}

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function pointsForCombo(combo: number): number {
  const step = Math.max(0, Math.min(6, Math.floor(combo)))
  return 8 + step * 2
}

export function playsLabel(plays: number): string {
  return `${plays} ${plays === 1 ? 'play' : 'plays'}`
}

export function describeRun(score: number, previousBest: number | null): RunStory {
  const safe = clampScore(score)
  const previous = previousBest === null ? null : clampScore(previousBest)
  const isNewBest = previous === null || safe > previous
  const best = previous === null ? safe : Math.max(previous, safe)
  const gap = previous === null ? null : previous - safe
  const nearMiss =
    !isNewBest && gap !== null && gap >= 1 && gap <= NEAR_MISS_GAP
      ? `Only ${gap} ${gap === 1 ? 'point' : 'points'} from your best!`
      : null
  return { score: safe, previousBest: previous, best, isNewBest, nearMiss }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readScore(value: unknown): number | null {
  const score = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isInteger(score) || score < 0 || score > 100) return null
  return score
}

function readPlays(value: unknown): number | null {
  const plays = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isInteger(plays) || plays < 1 || plays > 1_000_000) return null
  return plays
}

export function parseGameStat(value: unknown): GameStat | null {
  if (!isRecord(value)) return null
  const gameId = value.gameId ?? value.game_id
  const bestScore = readScore(value.bestScore ?? value.best_score)
  const plays = readPlays(value.plays)
  if (typeof gameId !== 'string' || !isArcadeId(gameId) || bestScore === null || plays === null) return null
  return { gameId, bestScore, plays }
}

export function parseGameRun(value: unknown): ParsedRun | null {
  if (!isRecord(value)) return null
  const gameId = value.gameId
  const score = readScore(value.score)
  const best = readScore(value.best)
  const plays = readPlays(value.plays)
  const previousRaw = value.previousBest
  const previousBest = previousRaw === null ? null : readScore(previousRaw)
  if (typeof gameId !== 'string' || !isArcadeId(gameId) || score === null || best === null || plays === null) return null
  if (previousRaw !== null && previousBest === null) return null
  if (typeof value.isNewBest !== 'boolean') return null
  if (previousBest === null ? plays !== 1 : plays < 2) return null
  const story = describeRun(score, previousBest)
  if (story.best !== best || story.isNewBest !== value.isNewBest) return null
  return { gameId, plays, story }
}
