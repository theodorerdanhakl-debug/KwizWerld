import { create } from 'zustand'

// Display cache only. Replace this from a server payload. Never increment it here.

export type EconomySnapshot = {
  exp: number | null
  diamonds: number | null
}

type EconomyState = EconomySnapshot & {
  replaceFromServer: (snapshot: EconomySnapshot) => void
}

export const useEconomyStore = create<EconomyState>((set) => ({
  exp: null,
  diamonds: null,
  replaceFromServer: (snapshot) => {
    set({ exp: snapshot.exp, diamonds: snapshot.diamonds })
  },
}))
