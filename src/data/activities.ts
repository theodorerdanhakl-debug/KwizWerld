import type { Grade, SubjectId } from './content'
import { isGrade, SUBJECT_IDS } from './content'
import { getTopic } from './curriculum'

export type LessonStep = {
  id: string
  text: string
  example?: string
  image?: string
}

export type CheckQuestion = {
  prompt: string
  choices: readonly string[]
  answer: number
  explanation: string
}

export type Flashcard = {
  id: string
  front: string
  back: string
}

export type QuestionType = 'multiple' | 'boolean' | 'typed'

export type PracticeQuestion = {
  id: string
  type: QuestionType
  prompt: string
  choices: readonly string[]
  answer: number | boolean | string
  accepted: readonly string[]
  explanation: string
  difficulty: 1 | 2 | 3
}

export type TopicActivity = {
  topicId: string
  subjectId: SubjectId
  grade: Grade
  learn: {
    steps: readonly LessonStep[]
    check: CheckQuestion
  }
  study: {
    cards: readonly Flashcard[]
  }
  practice: {
    questions: readonly PracticeQuestion[]
  }
}

const modules = import.meta.glob('./content/*/*.json', { eager: true }) as Record<string, { default: unknown }>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSubjectId(value: unknown): value is SubjectId {
  return typeof value === 'string' && SUBJECT_IDS.some((id) => id === value)
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function parseStep(value: unknown, index: number): LessonStep | null {
  if (!isRecord(value)) return null
  const text = readString(value, 'text')
  if (!text) return null
  const example = readString(value, 'example') ?? undefined
  const image = readString(value, 'image') ?? undefined
  return { id: `step-${index + 1}`, text, example, image }
}

function parseCheck(value: unknown): CheckQuestion | null {
  if (!isRecord(value)) return null
  const prompt = readString(value, 'prompt')
  const explanation = readString(value, 'explanation')
  if (!prompt || !explanation || !Array.isArray(value.choices) || value.choices.length < 2) return null
  if (!value.choices.every((choice) => typeof choice === 'string' && choice.trim().length > 0)) return null
  if (typeof value.answer !== 'number' || !Number.isInteger(value.answer)) return null
  if (value.answer < 0 || value.answer >= value.choices.length) return null
  return {
    prompt,
    choices: value.choices,
    answer: value.answer,
    explanation,
  }
}

function parseCard(value: unknown, index: number): Flashcard | null {
  if (!isRecord(value)) return null
  const front = readString(value, 'front')
  const back = readString(value, 'back')
  if (!front || !back) return null
  const id = readString(value, 'id') ?? `card-${index + 1}`
  return { id, front, back }
}

function parseDifficulty(value: unknown): 1 | 2 | 3 | null {
  if (value === 1 || value === 2 || value === 3) return value
  return null
}

function parseQuestion(value: unknown, index: number): PracticeQuestion | null {
  if (!isRecord(value)) return null
  const prompt = readString(value, 'prompt')
  const explanation = readString(value, 'explanation')
  const difficulty = parseDifficulty(value.difficulty)
  const type = value.type
  if (!prompt || !explanation || !difficulty) return null
  if (type !== 'multiple' && type !== 'boolean' && type !== 'typed') return null
  const id = readString(value, 'id') ?? `question-${index + 1}`
  if (type === 'multiple') {
    if (!Array.isArray(value.choices) || value.choices.length < 2) return null
    if (!value.choices.every((choice) => typeof choice === 'string' && choice.trim().length > 0)) return null
    if (typeof value.answer !== 'number' || !Number.isInteger(value.answer)) return null
    if (value.answer < 0 || value.answer >= value.choices.length) return null
    return {
      id,
      type,
      prompt,
      choices: value.choices,
      answer: value.answer,
      accepted: [],
      explanation,
      difficulty,
    }
  }
  if (type === 'boolean') {
    if (typeof value.answer !== 'boolean') return null
    return {
      id,
      type,
      prompt,
      choices: ['True', 'False'],
      answer: value.answer,
      accepted: [],
      explanation,
      difficulty,
    }
  }
  const answer = readString(value, 'answer')
  if (!answer) return null
  const accepted = Array.isArray(value.accepted)
    ? value.accepted.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
  return {
    id,
    type,
    prompt,
    choices: [],
    answer,
    accepted,
    explanation,
    difficulty,
  }
}

function parseActivity(value: unknown, file: string): TopicActivity {
  if (!isRecord(value)) throw new Error(`${file} must be an object`)
  const topicId = readString(value, 'topicId')
  if (!topicId || !isSubjectId(value.subjectId) || !isGrade(value.grade)) throw new Error(`${file} has a bad id`)
  const topic = getTopic(topicId)
  if (!topic || topic.subjectId !== value.subjectId || topic.grade !== value.grade) {
    throw new Error(`${file} does not match a curriculum topic`)
  }
  if (!isRecord(value.learn) || !isRecord(value.study) || !isRecord(value.practice)) {
    throw new Error(`${file} is missing a mode`)
  }
  if (!Array.isArray(value.learn.steps) || value.learn.steps.length === 0) throw new Error(`${file} has no lesson steps`)
  const steps = value.learn.steps.map((step, index) => {
    const parsed = parseStep(step, index)
    if (!parsed) throw new Error(`${file} lesson step ${index} is invalid`)
    return parsed
  })
  const check = parseCheck(value.learn.check)
  if (!check) throw new Error(`${file} check question is invalid`)
  if (!Array.isArray(value.study.cards) || value.study.cards.length < 10) {
    throw new Error(`${file} needs at least 10 flashcards`)
  }
  const cards = value.study.cards.map((card, index) => {
    const parsed = parseCard(card, index)
    if (!parsed) throw new Error(`${file} flashcard ${index} is invalid`)
    return parsed
  })
  if (!Array.isArray(value.practice.questions) || value.practice.questions.length < 10) {
    throw new Error(`${file} needs at least 10 questions`)
  }
  const questions = value.practice.questions.map((question, index) => {
    const parsed = parseQuestion(question, index)
    if (!parsed) throw new Error(`${file} question ${index} is invalid`)
    return parsed
  })
  const cardIds = new Set(cards.map((card) => card.id))
  if (cardIds.size !== cards.length) throw new Error(`${file} has duplicate flashcards`)
  const questionIds = new Set(questions.map((question) => question.id))
  if (questionIds.size !== questions.length) throw new Error(`${file} has duplicate questions`)
  return {
    topicId,
    subjectId: value.subjectId,
    grade: value.grade,
    learn: { steps, check },
    study: { cards },
    practice: { questions },
  }
}

const activities = Object.entries(modules).map(([file, module]) => parseActivity(module.default, file))

const byTopic = new Map(activities.map((activity) => [activity.topicId, activity]))

export function getActivity(topicId: string): TopicActivity | undefined {
  return byTopic.get(topicId)
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/[.\s]+$/g, '').replace(/\s+/g, ' ')
}

export function typedAnswerMatches(question: PracticeQuestion, value: string): boolean {
  const given = normalizeAnswer(value)
  if (!given) return false
  const accepted = [question.answer, ...question.accepted].filter((item): item is string => typeof item === 'string')
  return accepted.some((item) => normalizeAnswer(item) === given)
}

export function pickNextQuestion(remaining: readonly PracticeQuestion[], recent: readonly boolean[]): PracticeQuestion {
  const first = remaining[0]
  if (!first) throw new Error('No questions left')
  const sample = recent.slice(-3)
  let target: 1 | 2 | 3 = 2
  if (sample.length >= 2) {
    const accuracy = sample.filter(Boolean).length / sample.length
    if (accuracy >= 0.8) target = 3
    else if (accuracy <= 0.4) target = 1
  }
  return remaining.reduce((best, question) => {
    const bestGap = Math.abs(best.difficulty - target)
    const nextGap = Math.abs(question.difficulty - target)
    return nextGap < bestGap ? question : best
  }, first)
}
