import { create } from 'zustand'

// Display cache only. Replace this from a server payload. Never increment it here.

export type RewardGrant = {
  id: string
  exp: number
  diamonds: number
  totalExp: number
  totalDiamonds: number
  level: number
  previousLevel: number
  leveledUp: boolean
  capped: boolean
  replayed: boolean
}

export type EconomySnapshot = {
  exp: number | null
  diamonds: number | null
}

type EconomyState = EconomySnapshot & {
  grant: RewardGrant | null
  replaceFromServer: (snapshot: EconomySnapshot) => void
  presentGrant: (grant: RewardGrant) => void
  dismissGrant: () => void
}

export const useEconomyStore = create<EconomyState>((set) => ({
  exp: null,
  diamonds: null,
  grant: null,
  replaceFromServer: (snapshot) => {
    set((state) => ({
      exp: snapshot.exp,
      diamonds: snapshot.diamonds,
      grant: snapshot.exp === null && snapshot.diamonds === null ? null : state.grant,
    }))
  },
  presentGrant: (grant) => {
    const visible = !grant.replayed && (grant.exp > 0 || grant.diamonds > 0 || grant.capped)
    set({
      exp: grant.totalExp,
      diamonds: grant.totalDiamonds,
      grant: visible ? grant : null,
    })
  },
  dismissGrant: () => set({ grant: null }),
}))
