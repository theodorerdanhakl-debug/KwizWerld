import { create } from 'zustand'
import { clearAttempts, loadAttempts } from '../supabase/attempts'
import { clearGameStats, loadGameStats } from '../supabase/gameStats'
import { useGameStatsStore } from './gameStats'
import { getSupabase } from '../supabase/client'
import { deleteOwnAccount, fetchProfile, updateProfile, type Profile, type ProfilePatch } from '../supabase/profile'
import { useEconomyStore } from './economy'
import { applyReducedMotion, applySoundPreferences } from './preferences'
import { useThemeStore } from './theme'
import { useToastStore } from './toast'

type SessionStatus = 'loading' | 'ready'

type SessionState = {
  status: SessionStatus
  configured: boolean
  userId: string | null
  profile: Profile | null
  error: string | null
  refreshProfile: () => Promise<void>
  saveProfile: (patch: ProfilePatch) => Promise<{ ok: true } | { ok: false; message: string }>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<{ ok: true } | { ok: false; message: string }>
}

let started = false
let loadId = 0
let saveId = 0

function applyProfile(profile: Profile): void {
  useThemeStore.getState().setPreference(profile.theme)
  applyReducedMotion(profile.reducedMotion)
  applySoundPreferences(profile.soundEffects, profile.music)
  useEconomyStore.getState().replaceFromServer({
    exp: profile.exp,
    diamonds: profile.diamonds,
  })
  useSessionStore.setState({ status: 'ready', profile, error: null, userId: profile.id })
}

function clearAccount(): void {
  loadId += 1
  clearAttempts()
  clearGameStats()
  applyReducedMotion(false)
  applySoundPreferences(true, true)
  useEconomyStore.getState().replaceFromServer({ exp: null, diamonds: null })
  useSessionStore.setState({
    status: 'ready',
    userId: null,
    profile: null,
    error: null,
  })
}

async function loadProfile(userId: string): Promise<void> {
  const requestId = ++loadId
  const result = await fetchProfile(userId)
  if (requestId !== loadId) return
  if (useSessionStore.getState().userId !== userId) return
  if (!result.ok) {
    useSessionStore.setState({ status: 'ready', profile: null, error: result.message })
    return
  }
  applyProfile(result.profile)
}

export const useSessionStore = create<SessionState>(() => ({
  status: 'loading',
  configured: false,
  userId: null,
  profile: null,
  error: null,
  refreshProfile: async () => {
    const userId = useSessionStore.getState().userId
    if (!userId) return
    useSessionStore.setState({ status: 'loading', error: null })
    await loadProfile(userId)
  },
  saveProfile: async (patch) => {
    const userId = useSessionStore.getState().userId
    if (!userId) return { ok: false, message: 'Log in to save this.' }
    const requestId = ++saveId
    const result = await updateProfile(userId, patch)
    if (requestId !== saveId) return result.ok ? { ok: true } : result
    if (!result.ok) return result
    if (useSessionStore.getState().userId === userId) applyProfile(result.profile)
    return { ok: true }
  },
  signOut: async () => {
    const supabase = getSupabase()
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        useToastStore.getState().push('Could not log out. Try again.')
        return
      }
    }
    clearAccount()
  },
  deleteAccount: async () => {
    const result = await deleteOwnAccount()
    if (!result.ok) return result
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut({ scope: 'local' })
    clearAccount()
    return { ok: true }
  },
}))

export function initSession(): void {
  if (started) return
  started = true
  const supabase = getSupabase()
  if (!supabase) {
    clearAttempts()
    useGameStatsStore.getState().markOffline()
    useSessionStore.setState({ status: 'ready', configured: false })
    return
  }
  useSessionStore.setState({ configured: true })
  supabase.auth.onAuthStateChange((_event, session) => {
    const userId = session?.user.id ?? null
    if (!userId) {
      if (useSessionStore.getState().userId !== null || useSessionStore.getState().status === 'loading') {
        clearAccount()
      }
      return
    }
    if (useSessionStore.getState().userId === userId && useSessionStore.getState().profile) return
    useSessionStore.setState({ status: 'loading', userId, error: null })
    void loadAttempts()
    void loadGameStats()
    window.setTimeout(() => {
      void loadProfile(userId)
    }, 0)
  })
}
