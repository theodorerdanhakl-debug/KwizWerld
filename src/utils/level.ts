// EXP to leave a level is 20 + 12*level + 2*level*level.
// private.level_for_exp in the reward migration uses the same numbers.

const MAX_LEVEL = 80

export type LevelProgress = {
  level: number
  current: number
  needed: number
  ratio: number
  maxed: boolean
}

export function expToLeaveLevel(level: number): number {
  return 20 + 12 * level + 2 * level * level
}

export function levelProgress(exp: number): LevelProgress {
  let remaining = Math.max(0, Math.floor(exp))
  let level = 1
  while (level < MAX_LEVEL) {
    const needed = expToLeaveLevel(level)
    if (remaining < needed) {
      return { level, current: remaining, needed, ratio: remaining / needed, maxed: false }
    }
    remaining -= needed
    level += 1
  }
  const needed = expToLeaveLevel(MAX_LEVEL)
  return { level: MAX_LEVEL, current: needed, needed, ratio: 1, maxed: true }
}

export function getLevel(exp: number): number {
  return levelProgress(exp).level
}
