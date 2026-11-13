import { create } from 'zustand'
import type { LeaderboardBoard, LeaderboardWindow } from '../utils/leaderboard'

export type LeaderboardSlot = {
  board: LeaderboardBoard | null
  phase: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
}

type LeaderboardState = {
  slots: Record<LeaderboardWindow, LeaderboardSlot>
  begin: (board: LeaderboardWindow) => void
  succeed: (board: LeaderboardBoard) => void
  fail: (board: LeaderboardWindow, message: string) => void
}

function emptySlot(): LeaderboardSlot {
  return { board: null, phase: 'idle', error: null }
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  slots: { day: emptySlot(), week: emptySlot(), all: emptySlot() },
  begin: (board) =>
    set((state) => {
      const current = state.slots[board]
      return {
        slots: {
          ...state.slots,
          [board]: {
            ...current,
            phase: current.board ? current.phase : 'loading',
            error: null,
          },
        },
      }
    }),
  succeed: (board) =>
    set((state) => ({
      slots: {
        ...state.slots,
        [board.board]: { board, phase: 'ready', error: null },
      },
    })),
  fail: (board, message) =>
    set((state) => {
      const current = state.slots[board]
      if (current.board) {
        return {
          slots: {
            ...state.slots,
            [board]: { ...current, phase: 'ready', error: message },
          },
        }
      }
      return {
        slots: {
          ...state.slots,
          [board]: { board: null, phase: 'error', error: message },
        },
      }
    }),
}))
