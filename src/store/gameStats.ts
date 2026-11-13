import { create } from 'zustand'
import type { ArcadeId, GameStat } from '../games/core/result'

export type GameStatsStatus = 'loading' | 'ready' | 'offline' | 'error'

type GameStatsState = {
  status: GameStatsStatus
  byId: Partial<Record<ArcadeId, GameStat>>
  replace: (stats: GameStat[]) => void
  remember: (stat: GameStat) => void
  markOffline: () => void
  fail: () => void
  reset: () => void
}

export const useGameStatsStore = create<GameStatsState>((set) => ({
  status: 'loading',
  byId: {},
  replace: (stats) =>
    set({
      status: 'ready',
      byId: Object.fromEntries(stats.map((stat) => [stat.gameId, stat])),
    }),
  remember: (stat) =>
    set((state) => ({
      byId: { ...state.byId, [stat.gameId]: stat },
    })),
  markOffline: () => set({ status: 'offline' }),
  fail: () => set({ status: 'error' }),
  reset: () => set({ status: 'loading', byId: {} }),
}))
