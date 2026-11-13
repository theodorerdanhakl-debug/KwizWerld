const cosmeticId = /^[a-z0-9-]{1,40}$/

export type LeaderboardWindow = 'day' | 'week' | 'all'

export type EquippedCosmetics = {
  avatar: string | null
  decoration: string | null
  nameColor: string | null
  nameFont: string | null
  nameplate: string | null
  badges: string[]
}

export type LeaderboardEntry = {
  rank: number
  userId: string
  username: string
  exp: number
  cosmetics: EquippedCosmetics
}

export type LeaderboardViewer = LeaderboardEntry & {
  pinned: boolean
}

export type LeaderboardBoard = {
  board: LeaderboardWindow
  resetsAt: string | null
  entries: LeaderboardEntry[]
  viewer: LeaderboardViewer | null
}

const emptyCosmetics: EquippedCosmetics = {
  avatar: null,
  decoration: null,
  nameColor: null,
  nameFont: null,
  nameplate: null,
  badges: [],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cosmetic(value: unknown): string | null {
  return typeof value === 'string' && cosmeticId.test(value) ? value : null
}

export function equippedCosmetics(value: unknown): EquippedCosmetics {
  if (!isRecord(value)) return { ...emptyCosmetics }
  const badges = Array.isArray(value.badges)
    ? value.badges.filter((item): item is string => cosmetic(item) !== null).slice(0, 6)
    : []
  return {
    avatar: cosmetic(value.avatar),
    decoration: cosmetic(value.decoration),
    nameColor: cosmetic(value.nameColor),
    nameFont: cosmetic(value.nameFont),
    nameplate: cosmetic(value.nameplate),
    badges,
  }
}

export function isLeaderboardWindow(value: string): value is LeaderboardWindow {
  return value === 'day' || value === 'week' || value === 'all'
}

export function nextReset(board: LeaderboardWindow, now: Date): Date | null {
  if (board === 'all') return null
  const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  if (board === 'day') return new Date(dayStart + 24 * 60 * 60 * 1000)
  const weekday = now.getUTCDay()
  const daysUntilMonday = weekday === 0 ? 1 : weekday === 1 ? 7 : 8 - weekday
  return new Date(dayStart + daysUntilMonday * 24 * 60 * 60 * 1000)
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function readCount(value: unknown): number | null {
  const count = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isInteger(count) || count < 0) return null
  return count
}

function readEntry(value: unknown): LeaderboardEntry | null {
  if (!isRecord(value)) return null
  const rank = readCount(value.rank)
  const exp = readCount(value.exp)
  if (rank === null || rank < 1 || exp === null) return null
  if (typeof value.userId !== 'string' || value.userId.length === 0) return null
  if (typeof value.username !== 'string' || value.username.length === 0) return null
  return {
    rank,
    userId: value.userId,
    username: value.username,
    exp,
    cosmetics: equippedCosmetics(value.cosmetics),
  }
}

export function parseLeaderboard(value: unknown, board: LeaderboardWindow): LeaderboardBoard | null {
  if (!isRecord(value) || value.board !== board) return null
  if (!Array.isArray(value.entries)) return null
  const entries: LeaderboardEntry[] = []
  const seen = new Set<string>()
  for (const item of value.entries) {
    const entry = readEntry(item)
    if (!entry || seen.has(entry.userId)) continue
    seen.add(entry.userId)
    entries.push(entry)
    if (entries.length === 100) break
  }
  let resetsAt: string | null = null
  if (board !== 'all') {
    if (typeof value.resetsAt !== 'string') return null
    const time = Date.parse(value.resetsAt)
    if (Number.isNaN(time)) return null
    resetsAt = new Date(time).toISOString()
  }
  let viewer: LeaderboardViewer | null = null
  if (value.viewer !== null && value.viewer !== undefined) {
    const entry = readEntry(value.viewer)
    if (!entry) return null
    viewer = { ...entry, pinned: !seen.has(entry.userId) }
  }
  return { board, resetsAt, entries, viewer }
}

export function showPinnedViewer(
  entries: readonly { userId: string }[],
  viewer: { userId: string } | null,
): boolean {
  if (!viewer) return false
  return !entries.some((entry) => entry.userId === viewer.userId)
}
