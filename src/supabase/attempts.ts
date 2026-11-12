import { GRADES, MODE_IDS, SUBJECT_IDS, type Grade, type ModeId, type SubjectId } from '../data/content'
import { useProgressStore, type SavedAttempt } from '../store/progress'
import { getSupabase } from './client'

export type AttemptInput = {
  idempotencyKey: string
  topicId: string
  mode: ModeId
  score: number
  durationSeconds: number
}

let loadGeneration = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSubjectId(value: unknown): value is SubjectId {
  return typeof value === 'string' && SUBJECT_IDS.some((id) => id === value)
}

function isGrade(value: unknown): value is Grade {
  return typeof value === 'string' && GRADES.some((grade) => grade === value)
}

function isMode(value: unknown): value is ModeId {
  return typeof value === 'string' && MODE_IDS.some((mode) => mode === value)
}

function readScore(value: unknown): number | null {
  const score = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isFinite(score) || score < 0 || score > 1) return null
  return score
}

function readDuration(value: unknown): number | null {
  const duration = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isInteger(duration) || duration < 0 || duration > 7200) return null
  return duration
}

function parseAttempt(value: unknown): SavedAttempt | null {
  if (!isRecord(value)) return null
  const id = value.id
  const topicId = value.topicId ?? value.topic_id
  const subjectId = value.subjectId ?? value.subject
  const grade = value.grade
  const mode = value.mode
  const createdAt = value.createdAt ?? value.created_at
  const score = readScore(value.score)
  const durationSeconds = readDuration(value.durationSeconds ?? value.duration_seconds)
  if (typeof id !== 'string' || typeof topicId !== 'string' || typeof createdAt !== 'string') return null
  if (!isSubjectId(subjectId) || !isGrade(grade) || !isMode(mode)) return null
  if (score === null || durationSeconds === null) return null
  return { id, topicId, subjectId, grade, mode, score, durationSeconds, createdAt }
}

export async function loadAttempts(): Promise<void> {
  const generation = ++loadGeneration
  const supabase = getSupabase()
  if (!supabase) {
    if (generation !== loadGeneration) return
    useProgressStore.getState().reset()
    return
  }
  const { data, error } = await supabase
    .from('activity_attempts')
    .select('id, topic_id, subject, grade, mode, score, duration_seconds, created_at')
    .order('created_at', { ascending: true })
  if (generation !== loadGeneration) return
  if (error) {
    useProgressStore.getState().markLoaded()
    return
  }
  const attempts = (data ?? []).flatMap((row) => {
    const attempt = parseAttempt(row)
    return attempt ? [attempt] : []
  })
  useProgressStore.getState().replace(attempts)
}

export function clearAttempts(): void {
  loadGeneration += 1
  useProgressStore.getState().reset()
}

export async function recordAttempt(input: AttemptInput): Promise<void> {
  const generation = loadGeneration
  const supabase = getSupabase()
  if (!supabase) return
  const score = readScore(input.score)
  const durationSeconds = readDuration(input.durationSeconds)
  if (score === null || durationSeconds === null) return
  const { data, error } = await supabase.rpc('record_attempt', {
    topic_id: input.topicId,
    mode: input.mode,
    score,
    duration_seconds: durationSeconds,
    idempotency_key: input.idempotencyKey,
  })
  if (generation !== loadGeneration || error || !isRecord(data) || data.replayed === true) return
  const attempt = parseAttempt(data)
  if (!attempt) return
  useProgressStore.getState().add(attempt)
}
