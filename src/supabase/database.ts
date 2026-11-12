// Stand-in for `supabase gen types` until a project is linked.
// Keep this aligned with supabase/migrations. Do not copy the table shape anywhere else.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          grade_level: string
          exp: number
          diamonds: number
          level: number
          cosmetics: Json
          theme: string
          sound_effects: boolean
          music: boolean
          reduced_motion: boolean
          created_at: string
        }
        Insert: {
          id: string
          username: string
          grade_level: string
          exp?: number
          diamonds?: number
          level?: number
          cosmetics?: Json
          theme?: string
          sound_effects?: boolean
          music?: boolean
          reduced_motion?: boolean
          created_at?: string
        }
        Update: {
          username?: string
          grade_level?: string
          theme?: string
          sound_effects?: boolean
          music?: boolean
          reduced_motion?: boolean
        }
        Relationships: []
      }
      reward_events: {
        Row: {
          id: string
          user_id: string
          source: string
          exp: number
          diamonds: number
          created_at: string
          idempotency_key: string
        }
        Insert: {
          id?: string
          user_id: string
          source: string
          exp: number
          diamonds: number
          created_at?: string
          idempotency_key: string
        }
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      delete_own_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      award_rewards: {
        Args: { source: string; metadata: Json }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
