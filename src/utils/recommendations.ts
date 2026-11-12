import type { Grade, ModeId, SubjectId } from '../data/content'

export type Mastery = 'not-started' | 'learning' | 'proficient' | 'mastered'

export type AttemptRecord = {
  topicId: string
  mode: ModeId
  score: number
  createdAt: string
}

export type TopicRef = {
  id: string
  name: string
  subjectId: SubjectId
  grade: Grade
}

export type RecommendationKind = 'weak' | 'continue' | 'level-up' | 'start'

export type Recommendation = {
  topicId: string
  title: string
  mode: ModeId
  kind: RecommendationKind
  reason: string
}

export type SubjectProgress = {
  subjectId: SubjectId
  mastered: number
  proficient: number
  learning: number
  notStarted: number
}

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const
const SUBJECTS = ['math', 'english', 'geography', 'science', 'history'] as const satisfies readonly SubjectId[]
const MODES = ['learn', 'study', 'practice'] as const satisfies readonly ModeId[]
const MAX_RECOMMENDATIONS = 3

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.min(1, Math.max(0, score))
}

function byCreated(a: AttemptRecord, b: AttemptRecord): number {
  return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
}

function gradeIndex(grade: Grade): number {
  return GRADES.indexOf(grade)
}

function gradePhrase(grade: Grade): string {
  return grade === 'K' ? 'Kindergarten' : `grade ${grade}`
}

function orderedTopics(topics: readonly TopicRef[], subjectId: SubjectId): TopicRef[] {
  return topics
    .filter((topic) => topic.subjectId === subjectId)
    .map((topic, index) => ({ topic, index }))
    .sort((a, b) => {
      const grade = gradeIndex(a.topic.grade) - gradeIndex(b.topic.grade)
      if (grade !== 0) return grade
      return a.index - b.index
    })
    .map((item) => item.topic)
}

function groupAttempts(attempts: readonly AttemptRecord[]): Map<string, AttemptRecord[]> {
  const grouped = new Map<string, AttemptRecord[]>()
  for (const attempt of attempts) {
    const list = grouped.get(attempt.topicId)
    if (list) list.push(attempt)
    else grouped.set(attempt.topicId, [attempt])
  }
  for (const list of grouped.values()) list.sort(byCreated)
  return grouped
}

export function masteryFor(attempts: readonly AttemptRecord[]): Mastery {
  if (attempts.length === 0) return 'not-started'
  const ordered = [...attempts].sort(byCreated)
  const recent = ordered.slice(-3)
  const average = recent.reduce((sum, item) => sum + clampScore(item.score), 0) / recent.length
  const passedLesson = ordered.some((item) => item.mode === 'learn' && clampScore(item.score) >= 1)
  if (ordered.length >= 3 && average >= 0.9 && passedLesson) return 'mastered'
  if (ordered.length >= 2 && average >= 0.7) return 'proficient'
  return 'learning'
}

export function masteryValue(mastery: Mastery): number {
  if (mastery === 'learning') return 0.34
  if (mastery === 'proficient') return 0.67
  if (mastery === 'mastered') return 1
  return 0
}

export function masteryLabel(mastery: Mastery): string {
  if (mastery === 'not-started') return 'Not Started'
  if (mastery === 'learning') return 'Learning'
  if (mastery === 'proficient') return 'Proficient'
  return 'Mastered'
}

export function elapsedSeconds(startedAt: number, now: number): number {
  const seconds = Math.round((now - startedAt) / 1000)
  if (!Number.isFinite(seconds) || seconds < 0) return 0
  return Math.min(7200, seconds)
}

export function recommendNext(input: {
  subjectId: SubjectId
  grade: Grade
  attempts: readonly AttemptRecord[]
  topics: readonly TopicRef[]
}): Recommendation[] {
  const catalog = orderedTopics(input.topics, input.subjectId)
  const grouped = groupAttempts(input.attempts)
  const mastery = new Map(catalog.map((topic) => [topic.id, masteryFor(grouped.get(topic.id) ?? [])]))
  const chosen = new Set<string>()
  const cards: Recommendation[] = []

  function push(card: Recommendation): boolean {
    if (cards.length >= MAX_RECOMMENDATIONS || chosen.has(card.topicId)) return false
    chosen.add(card.topicId)
    cards.push(card)
    return true
  }

  const weak = catalog
    .flatMap((topic) => {
      const attempts = grouped.get(topic.id) ?? []
      const graded = attempts.filter((item) => item.mode === 'study' || item.mode === 'practice')
      const latest = graded[graded.length - 1]
      if (!latest || clampScore(latest.score) >= 0.7 || mastery.get(topic.id) === 'mastered') return []
      return [{ topic, score: clampScore(latest.score), mode: latest.mode }]
    })
    .sort((a, b) => a.score - b.score || a.topic.name.localeCompare(b.topic.name))

  for (const item of weak) {
    const percent = Math.round(item.score * 100)
    const verb = item.mode === 'study' ? "Let's study!" : "Let's practice!"
    push({
      topicId: item.topic.id,
      title: item.topic.name,
      mode: item.mode,
      kind: 'weak',
      reason: `You scored ${percent}% on ${item.topic.name}. ${verb}`,
    })
  }

  const unfinished = catalog
    .flatMap((topic) => {
      const attempts = grouped.get(topic.id) ?? []
      const learned = attempts.filter((item) => item.mode === 'learn')
      const latestLearn = learned[learned.length - 1]
      const hasOther = attempts.some((item) => item.mode !== 'learn')
      if (latestLearn && clampScore(latestLearn.score) < 1) {
        return [{ topic, at: latestLearn.createdAt, reason: `Finish the ${topic.name} lesson.` }]
      }
      if (!latestLearn && hasOther) {
        return [{ topic, at: attempts[attempts.length - 1]?.createdAt ?? '', reason: `Start the ${topic.name} lesson.` }]
      }
      return []
    })
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : a.topic.name.localeCompare(b.topic.name)))

  for (const item of unfinished) {
    push({
      topicId: item.topic.id,
      title: item.topic.name,
      mode: 'learn',
      kind: 'continue',
      reason: item.reason,
    })
  }

  const mastered = catalog
    .filter((topic) => mastery.get(topic.id) === 'mastered')
    .sort((a, b) => {
      const aAt = grouped.get(a.id)?.at(-1)?.createdAt ?? ''
      const bAt = grouped.get(b.id)?.at(-1)?.createdAt ?? ''
      return aAt < bAt ? 1 : aAt > bAt ? -1 : a.name.localeCompare(b.name)
    })

  for (const topic of mastered) {
    const index = catalog.findIndex((item) => item.id === topic.id)
    const next = catalog.slice(index + 1).find((item) => mastery.get(item.id) !== 'mastered' && !chosen.has(item.id))
    if (!next) continue
    const reason =
      next.grade === topic.grade
        ? `You mastered ${topic.name}. Try ${next.name} next.`
        : `You mastered ${topic.name}. Try ${next.name} ${next.grade === 'K' ? 'in Kindergarten' : `in grade ${next.grade}`}.`
    push({
      topicId: next.id,
      title: next.name,
      mode: 'learn',
      kind: 'level-up',
      reason,
    })
  }

  const starters = catalog.filter((topic) => topic.grade === input.grade && mastery.get(topic.id) === 'not-started')
  let starterMode = 0
  for (const topic of starters) {
    const added = push({
      topicId: topic.id,
      title: topic.name,
      mode: MODES[starterMode % MODES.length] ?? 'learn',
      kind: 'start',
      reason: `A good place to start in ${gradePhrase(input.grade)}.`,
    })
    if (added) starterMode += 1
  }

  return cards
}

export function progressBySubject(
  attempts: readonly AttemptRecord[],
  topics: readonly TopicRef[],
): SubjectProgress[] {
  const grouped = groupAttempts(attempts)
  return SUBJECTS.map((subjectId) => {
    const counts = { mastered: 0, proficient: 0, learning: 0, notStarted: 0 }
    for (const topic of topics) {
      if (topic.subjectId !== subjectId) continue
      const mastery = masteryFor(grouped.get(topic.id) ?? [])
      counts[mastery === 'not-started' ? 'notStarted' : mastery] += 1
    }
    return { subjectId, ...counts }
  })
}

export function progressLine(summary: SubjectProgress): string {
  const parts: string[] = []
  if (summary.mastered > 0) parts.push(`${summary.mastered} mastered`)
  if (summary.proficient > 0) parts.push(`${summary.proficient} proficient`)
  if (summary.learning > 0) parts.push(`${summary.learning} learning`)
  return parts.length > 0 ? parts.join(', ') : 'Not Started'
}
