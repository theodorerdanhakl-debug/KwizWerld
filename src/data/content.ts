import gamesFile from './games.json'
import modesFile from './modes.json'
import subjectsFile from './subjects.json'

export const SUBJECT_IDS = ['math', 'english', 'geography', 'science', 'history'] as const
export type SubjectId = (typeof SUBJECT_IDS)[number]

export const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const
export type Grade = (typeof GRADES)[number]

export const MODE_IDS = ['learn', 'study', 'practice'] as const
export type ModeId = (typeof MODE_IDS)[number]

export type Subject = {
  id: SubjectId
  name: string
  subject: SubjectId
  grade: 'K-12'
  summary: string
}

export type Mode = {
  id: ModeId
  label: string
  summary: string
}

export type Game = {
  id: string
  name: string
  subject: SubjectId
  grade: Grade
  summary: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSubjectId(value: unknown): value is SubjectId {
  return typeof value === 'string' && SUBJECT_IDS.some((id) => id === value)
}

function isGrade(value: unknown): value is Grade {
  return typeof value === 'string' && GRADES.some((grade) => grade === value)
}

function isModeId(value: unknown): value is ModeId {
  return typeof value === 'string' && MODE_IDS.some((id) => id === value)
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function parseSubject(value: unknown): Subject | null {
  if (!isRecord(value)) return null
  const name = readString(value, 'name')
  const summary = readString(value, 'summary')
  if (!isSubjectId(value.id) || !isSubjectId(value.subject) || value.id !== value.subject) return null
  if (!name || !summary || value.grade !== 'K-12') return null
  return { id: value.id, subject: value.subject, name, summary, grade: 'K-12' }
}

function parseMode(value: unknown): Mode | null {
  if (!isRecord(value) || !isModeId(value.id)) return null
  const label = readString(value, 'label')
  const summary = readString(value, 'summary')
  if (!label || !summary) return null
  return { id: value.id, label, summary }
}

function parseGame(value: unknown): Game | null {
  if (!isRecord(value)) return null
  const id = readString(value, 'id')
  const name = readString(value, 'name')
  const summary = readString(value, 'summary')
  if (!id || !name || !summary || !isSubjectId(value.subject) || !isGrade(value.grade)) return null
  return { id, name, summary, subject: value.subject, grade: value.grade }
}

function parseList<T>(value: unknown, parse: (item: unknown) => T | null, label: string): readonly T[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be a list`)
  return value.map((item, index) => {
    const parsed = parse(item)
    if (!parsed) throw new Error(`${label} item ${index} is invalid`)
    return parsed
  })
}

function uniqueIds<T extends { id: string }>(items: readonly T[], label: string): readonly T[] {
  const seen = new Set<string>()
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`${label} has a duplicate id ${item.id}`)
    seen.add(item.id)
  }
  return items
}

function widen(value: object): unknown {
  return value
}

const subjects = uniqueIds(parseList(widen(subjectsFile), parseSubject, 'subjects.json'), 'subjects.json')
const modes = uniqueIds(parseList(widen(modesFile), parseMode, 'modes.json'), 'modes.json')
const games = uniqueIds(parseList(widen(gamesFile), parseGame, 'games.json'), 'games.json')

for (const id of SUBJECT_IDS) {
  if (!subjects.some((subject) => subject.id === id)) {
    throw new Error(`subjects.json is missing ${id}`)
  }
}

for (const id of MODE_IDS) {
  if (!modes.some((mode) => mode.id === id)) {
    throw new Error(`modes.json is missing ${id}`)
  }
}

export function getSubjects(): readonly Subject[] {
  return SUBJECT_IDS.flatMap((id) => {
    const subject = subjects.find((item) => item.id === id)
    return subject ? [subject] : []
  })
}

export function getSubject(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id)
}

export function getModes(): readonly Mode[] {
  return MODE_IDS.flatMap((id) => {
    const mode = modes.find((item) => item.id === id)
    return mode ? [mode] : []
  })
}

export function getMode(id: string): Mode | undefined {
  return modes.find((mode) => mode.id === id)
}

export function getGames(): readonly Game[] {
  return games
}

export function getGame(id: string): Game | undefined {
  return games.find((game) => game.id === id)
}

export function subjectName(id: SubjectId): string {
  return getSubject(id)?.name ?? id
}

export function gradeLabel(grade: Grade): string {
  return grade === 'K' ? 'Kindergarten' : `Grade ${grade}`
}
