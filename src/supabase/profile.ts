import type { Grade } from '../data/content'
import type { ThemePreference } from '../store/theme'
import { isGrade } from '../data/content'
import { friendlyAuthError, isTheme } from '../utils/accountForm'
import { getSupabase } from './client'
import type { Database, Json } from './database'

export type Profile = {
  id: string
  username: string
  gradeLevel: Grade
  exp: number
  diamonds: number
  level: number
  createdAt: string
  cosmetics: Record<string, Json | undefined>
  theme: ThemePreference
  soundEffects: boolean
  music: boolean
  reducedMotion: boolean
}

export type ProfilePatch = {
  username?: string
  gradeLevel?: Grade
  theme?: ThemePreference
  soundEffects?: boolean
  music?: boolean
  reducedMotion?: boolean
}

export type ProfileResult = { ok: true; profile: Profile } | { ok: false; message: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCosmetics(value: unknown): value is Record<string, Json | undefined> {
  return isRecord(value)
}

export function parseProfile(value: unknown): Profile | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string') return null
  if (typeof value.username !== 'string') return null
  if (typeof value.grade_level !== 'string' || !isGrade(value.grade_level)) return null
  if (typeof value.exp !== 'number' || typeof value.diamonds !== 'number') return null
  if (typeof value.level !== 'number') return null
  if (typeof value.created_at !== 'string') return null
  if (typeof value.theme !== 'string' || !isTheme(value.theme)) return null
  if (typeof value.sound_effects !== 'boolean' || typeof value.music !== 'boolean') return null
  if (typeof value.reduced_motion !== 'boolean') return null
  if (!isCosmetics(value.cosmetics)) return null
  return {
    id: value.id,
    username: value.username,
    gradeLevel: value.grade_level,
    exp: value.exp,
    diamonds: value.diamonds,
    level: value.level,
    createdAt: value.created_at,
    cosmetics: value.cosmetics,
    theme: value.theme,
    soundEffects: value.sound_effects,
    music: value.music,
    reducedMotion: value.reduced_motion,
  }
}

export async function fetchProfile(userId: string): Promise<ProfileResult> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, message: 'Supabase is not configured for this app yet.' }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) return { ok: false, message: friendlyAuthError(error) }
  if (!data) return { ok: false, message: 'Your profile is missing.' }
  const profile = parseProfile(data)
  if (!profile) return { ok: false, message: 'Your profile could not be read.' }
  return { ok: true, profile }
}

export async function updateProfile(userId: string, patch: ProfilePatch): Promise<ProfileResult> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, message: 'Supabase is not configured for this app yet.' }
  const update: ProfileUpdate = {}
  if (patch.username !== undefined) update.username = patch.username
  if (patch.gradeLevel !== undefined) update.grade_level = patch.gradeLevel
  if (patch.theme !== undefined) update.theme = patch.theme
  if (patch.soundEffects !== undefined) update.sound_effects = patch.soundEffects
  if (patch.music !== undefined) update.music = patch.music
  if (patch.reducedMotion !== undefined) update.reduced_motion = patch.reducedMotion

  const { data, error } = await supabase.from('profiles').update(update).eq('id', userId).select('*').maybeSingle()
  if (error) return { ok: false, message: friendlyAuthError(error) }
  if (!data) return { ok: false, message: 'Your profile could not be saved.' }
  const profile = parseProfile(data)
  if (!profile) return { ok: false, message: 'Your profile could not be read.' }
  return { ok: true, profile }
}

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function deleteOwnAccount(): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, message: 'Supabase is not configured for this app yet.' }
  const { error } = await supabase.rpc('delete_own_account')
  if (error) return { ok: false, message: friendlyAuthError(error) }
  return { ok: true }
}
