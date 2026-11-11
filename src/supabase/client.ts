import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database'

export type AppSupabaseClient = SupabaseClient<Database>

let client: AppSupabaseClient | null | undefined

function readEnv(value: string | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function getSupabase(): AppSupabaseClient | null {
  if (client !== undefined) return client
  const url = readEnv(import.meta.env.VITE_SUPABASE_URL)
  const key = readEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!url || !key) {
    client = null
    return null
  }
  try {
    client = createClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch {
    client = null
  }
  return client
}
