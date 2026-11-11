import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Reads go through this client. EXP, diamonds, and gacha rolls must use server RPC.

let client: SupabaseClient | null | undefined

function readEnv(value: string | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = readEnv(import.meta.env.VITE_SUPABASE_URL)
  const key = readEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!url || !key) {
    client = null
    return null
  }
  client = createClient(url, key)
  return client
}
