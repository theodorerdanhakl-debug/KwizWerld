import { getGame } from '../data/content'
import { useEconomyStore, type RewardGrant } from '../store/economy'
import { useSessionStore } from '../store/session'
import { getSupabase } from './client'
import type { Json } from './database'

export type RewardMetadata = {
  idempotencyKey: string
  score: number
  topicId?: string
}

const sourcePattern = /^(learn|practice|study|game:[a-z0-9-]{1,40})$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readCount(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null
}

function parseGrant(value: unknown, id: string): RewardGrant | null {
  if (!isRecord(value)) return null
  const exp = readCount(value.exp)
  const diamonds = readCount(value.diamonds)
  const totalExp = readCount(value.totalExp)
  const totalDiamonds = readCount(value.totalDiamonds)
  const level = readCount(value.level)
  const previousLevel = readCount(value.previousLevel)
  if (
    exp === null ||
    diamonds === null ||
    totalExp === null ||
    totalDiamonds === null ||
    level === null ||
    previousLevel === null ||
    level < 1 ||
    previousLevel < 1
  ) {
    return null
  }
  if (typeof value.leveledUp !== 'boolean' || typeof value.capped !== 'boolean' || typeof value.replayed !== 'boolean') {
    return null
  }
  if (value.leveledUp && level <= previousLevel) return null
  return {
    id,
    exp,
    diamonds,
    totalExp,
    totalDiamonds,
    level,
    previousLevel,
    leveledUp: value.leveledUp,
    capped: value.capped,
    replayed: value.replayed,
  }
}

function metadataJson(metadata: RewardMetadata): Json {
  const body: { [key: string]: Json } = {
    idempotencyKey: metadata.idempotencyKey,
    score: metadata.score,
  }
  if (metadata.topicId) body.topicId = metadata.topicId
  return body
}

export type AwardOptions = {
  announce?: boolean
}

export async function awardRewards(
  source: string,
  metadata: RewardMetadata,
  options?: AwardOptions,
): Promise<RewardGrant | null> {
  if (!sourcePattern.test(source) || !Number.isFinite(metadata.score)) return null
  const supabase = getSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.rpc('award_rewards', {
    source,
    metadata: metadataJson(metadata),
  })
  if (error) return null
  const grant = parseGrant(data, metadata.idempotencyKey)
  if (!grant) return null
  if (options?.announce === false) {
    useEconomyStore.getState().replaceFromServer({
      exp: grant.totalExp,
      diamonds: grant.totalDiamonds,
    })
  } else {
    useEconomyStore.getState().presentGrant(grant)
  }
  const profile = useSessionStore.getState().profile
  if (profile) {
    useSessionStore.setState({
      profile: {
        ...profile,
        exp: grant.totalExp,
        diamonds: grant.totalDiamonds,
        level: grant.level,
      },
    })
  }
  return grant
}

export async function awardGameRewards(
  gameId: string,
  score: number,
  idempotencyKey: string,
  options?: AwardOptions,
): Promise<RewardGrant | null> {
  if (!getGame(gameId)) return null
  return awardRewards(`game:${gameId}`, { score, idempotencyKey }, options)
}
