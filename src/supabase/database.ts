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
      activity_attempts: {
        Row: {
          id: string
          user_id: string
          subject: string
          topic_id: string
          grade: string
          mode: string
          score: number
          duration_seconds: number
          created_at: string
          idempotency_key: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          topic_id: string
          grade: string
          mode: string
          score: number
          duration_seconds: number
          created_at?: string
          idempotency_key: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      game_stats: {
        Row: {
          user_id: string
          game_id: string
          best_score: number
          plays: number
          updated_at: string
        }
        Insert: {
          user_id: string
          game_id: string
          best_score: number
          plays: number
          updated_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      leaderboard_scores: {
        Row: {
          user_id: string
          window_kind: string
          window_start: string
          exp: number
        }
        Insert: {
          user_id: string
          window_kind: string
          window_start: string
          exp: number
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
      record_attempt: {
        Args: {
          topic_id: string
          mode: string
          score: number
          duration_seconds: number
          idempotency_key: string
        }
        Returns: Json
      }
      leaderboard: {
        Args: { board: string }
        Returns: Json
      }
      record_game_run: {
        Args: { game_id: string; score: number }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
