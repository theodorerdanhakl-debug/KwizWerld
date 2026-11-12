import { create } from 'zustand'
import type { Grade, ModeId, SubjectId } from '../data/content'

export type SavedAttempt = {
  id: string
  topicId: string
  subjectId: SubjectId
  grade: Grade
  mode: ModeId
  score: number
  durationSeconds: number
  createdAt: string
}

type ProgressState = {
  attempts: SavedAttempt[]
  loaded: boolean
  add: (attempt: SavedAttempt) => void
  replace: (attempts: SavedAttempt[]) => void
  markLoaded: () => void
  reset: () => void
}

function byDate(a: SavedAttempt, b: SavedAttempt): number {
  return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
}

export const useProgressStore = create<ProgressState>((set) => ({
  attempts: [],
  loaded: false,
  add: (attempt) =>
    set((state) => {
      if (state.attempts.some((item) => item.id === attempt.id)) return state
      return { attempts: [...state.attempts, attempt].sort(byDate) }
    }),
  replace: (attempts) =>
    set((state) => {
      const byId = new Map(attempts.map((item) => [item.id, item]))
      for (const attempt of state.attempts) {
        if (!byId.has(attempt.id)) byId.set(attempt.id, attempt)
      }
      return { attempts: [...byId.values()].sort(byDate), loaded: true }
    }),
  markLoaded: () => set({ loaded: true }),
  reset: () => set({ attempts: [], loaded: true }),
}))
