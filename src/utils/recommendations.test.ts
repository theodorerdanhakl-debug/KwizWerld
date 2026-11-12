import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  elapsedSeconds,
  masteryFor,
  masteryLabel,
  progressBySubject,
  progressLine,
  recommendNext,
  type AttemptRecord,
  type TopicRef,
} from './recommendations.ts'

const topics: TopicRef[] = [
  { id: 'math-5-fractions', name: 'Fractions', subjectId: 'math', grade: '5' },
  { id: 'math-5-decimals', name: 'Decimals', subjectId: 'math', grade: '5' },
  { id: 'math-5-volume', name: 'Volume', subjectId: 'math', grade: '5' },
  { id: 'math-5-order', name: 'Order of operations', subjectId: 'math', grade: '5' },
  { id: 'math-6-ratios', name: 'Ratios', subjectId: 'math', grade: '6' },
  { id: 'english-5-poetry', name: 'Poetry', subjectId: 'english', grade: '5' },
]

function attempt(
  topicId: string,
  mode: AttemptRecord['mode'],
  score: number,
  createdAt: string,
): AttemptRecord {
  return { topicId, mode, score, createdAt }
}

function recommend(attempts: AttemptRecord[], grade: TopicRef['grade'] = '5') {
  return recommendNext({ subjectId: 'math', grade, attempts, topics })
}

test('a new student gets starter topics at their grade', () => {
  const cards = recommend([])
  assert.equal(cards.length, 3)
  assert.deepEqual(
    cards.map((card) => card.title),
    ['Fractions', 'Decimals', 'Volume'],
  )
  assert.deepEqual(
    cards.map((card) => card.mode),
    ['learn', 'study', 'practice'],
  )
  assert.equal(cards.every((card) => card.kind === 'start'), true)
  assert.equal(cards[0]?.reason, 'A good place to start in grade 5.')
})

test('kindergarten starters name Kindergarten', () => {
  const cards = recommendNext({
    subjectId: 'math',
    grade: 'K',
    attempts: [],
    topics: [{ id: 'math-k-count', name: 'Counting', subjectId: 'math', grade: 'K' }],
  })
  assert.equal(cards[0]?.reason, 'A good place to start in Kindergarten.')
})

test('a low score recommends that topic with the score in the reason', () => {
  const cards = recommend([attempt('math-5-fractions', 'practice', 0.6, '2026-11-12T12:00:00Z')])
  assert.equal(cards[0]?.kind, 'weak')
  assert.equal(cards[0]?.mode, 'practice')
  assert.equal(cards[0]?.topicId, 'math-5-fractions')
  assert.equal(cards[0]?.reason, "You scored 60% on Fractions. Let's practice!")
})

test('a low study score suggests study', () => {
  const cards = recommend([attempt('math-5-fractions', 'study', 0.5, '2026-11-12T12:00:00Z')])
  assert.equal(cards[0]?.reason, "You scored 50% on Fractions. Let's study!")
  assert.equal(cards[0]?.mode, 'study')
})

test('the weakest recent score comes first', () => {
  const cards = recommend([
    attempt('math-5-fractions', 'practice', 0.6, '2026-11-12T12:00:00Z'),
    attempt('math-5-decimals', 'practice', 0.2, '2026-11-12T12:05:00Z'),
  ])
  assert.equal(cards[0]?.title, 'Decimals')
  assert.equal(cards[1]?.title, 'Fractions')
})

test('a later passing score clears the weak spot', () => {
  const cards = recommend([
    attempt('math-5-fractions', 'practice', 0.4, '2026-11-12T12:00:00Z'),
    attempt('math-5-fractions', 'practice', 0.8, '2026-11-12T12:10:00Z'),
  ])
  assert.equal(
    cards.some((card) => card.kind === 'weak'),
    false,
  )
})

test('a missed lesson check is something to finish', () => {
  const cards = recommend([attempt('math-5-fractions', 'learn', 0, '2026-11-12T12:00:00Z')])
  assert.equal(cards[0]?.kind, 'continue')
  assert.equal(cards[0]?.mode, 'learn')
  assert.equal(cards[0]?.reason, 'Finish the Fractions lesson.')
})

test('practice without a lesson asks them to start the lesson', () => {
  const cards = recommend([attempt('math-5-fractions', 'practice', 0.9, '2026-11-12T12:00:00Z')])
  const card = cards.find((item) => item.topicId === 'math-5-fractions')
  assert.equal(card?.kind, 'continue')
  assert.equal(card?.reason, 'Start the Fractions lesson.')
})

test('a mastered topic points at the next topic', () => {
  const cards = recommend([
    attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z'),
    attempt('math-5-fractions', 'practice', 1, '2026-11-12T12:05:00Z'),
    attempt('math-5-fractions', 'practice', 0.95, '2026-11-12T12:10:00Z'),
  ])
  assert.equal(cards[0]?.kind, 'level-up')
  assert.equal(cards[0]?.title, 'Decimals')
  assert.equal(cards[0]?.reason, 'You mastered Fractions. Try Decimals next.')
  assert.equal(
    cards.some((card) => card.topicId === 'math-5-fractions'),
    false,
  )
})

test('mastering the last topic in a grade steps up a grade', () => {
  const passed = (topicId: string, at: string): AttemptRecord[] => [
    attempt(topicId, 'learn', 1, at),
    attempt(topicId, 'practice', 1, at),
    attempt(topicId, 'study', 1, at),
  ]
  const cards = recommend([
    ...passed('math-5-fractions', '2026-11-12T12:00:00Z'),
    ...passed('math-5-decimals', '2026-11-12T12:01:00Z'),
    ...passed('math-5-volume', '2026-11-12T12:02:00Z'),
    ...passed('math-5-order', '2026-11-12T12:03:00Z'),
  ])
  assert.equal(cards[0]?.title, 'Ratios')
  assert.equal(cards[0]?.reason, 'You mastered Order of operations. Try Ratios in grade 6.')
})

test('weak spots, unfinished lessons, and level-ups fill before starters', () => {
  const cards = recommend([
    attempt('math-5-fractions', 'practice', 0.6, '2026-11-12T12:00:00Z'),
    attempt('math-5-decimals', 'learn', 0, '2026-11-12T12:05:00Z'),
    attempt('math-5-volume', 'learn', 1, '2026-11-12T12:06:00Z'),
    attempt('math-5-volume', 'practice', 1, '2026-11-12T12:07:00Z'),
    attempt('math-5-volume', 'practice', 1, '2026-11-12T12:08:00Z'),
  ])
  assert.deepEqual(
    cards.map((card) => card.kind),
    ['weak', 'continue', 'level-up'],
  )
  assert.deepEqual(
    cards.map((card) => card.title),
    ['Fractions', 'Decimals', 'Order of operations'],
  )
})

test('recommendations stay at three and do not repeat a topic', () => {
  const cards = recommend([
    attempt('math-5-fractions', 'practice', 0.1, '2026-11-12T12:00:00Z'),
    attempt('math-5-decimals', 'practice', 0.2, '2026-11-12T12:01:00Z'),
    attempt('math-5-volume', 'practice', 0.3, '2026-11-12T12:02:00Z'),
    attempt('math-5-order', 'practice', 0.4, '2026-11-12T12:03:00Z'),
    attempt('math-5-fractions', 'learn', 0, '2026-11-12T12:04:00Z'),
  ])
  assert.equal(cards.length, 3)
  assert.equal(new Set(cards.map((card) => card.topicId)).size, 3)
  assert.deepEqual(
    cards.map((card) => card.title),
    ['Fractions', 'Decimals', 'Volume'],
  )
  assert.equal(
    cards.some((card) => card.kind === 'start'),
    false,
  )
})

test('attempts in another subject stay out of this subject', () => {
  const cards = recommend([attempt('english-5-poetry', 'practice', 0.1, '2026-11-12T12:00:00Z')])
  assert.equal(
    cards.every((card) => card.kind === 'start'),
    true,
  )
})

test('one finished lesson does not count as mastered', () => {
  assert.equal(masteryFor([attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z')]), 'learning')
  const cards = recommend([attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z')])
  assert.equal(
    cards.some((card) => card.topicId === 'math-5-fractions'),
    false,
  )
})

test('mastery follows recent scores and a passed lesson', () => {
  assert.equal(masteryFor([]), 'not-started')
  assert.equal(masteryFor([attempt('math-5-fractions', 'practice', 0.4, '2026-11-12T12:00:00Z')]), 'learning')
  assert.equal(
    masteryFor([
      attempt('math-5-fractions', 'practice', 0.8, '2026-11-12T12:00:00Z'),
      attempt('math-5-fractions', 'practice', 0.8, '2026-11-12T12:01:00Z'),
    ]),
    'proficient',
  )
  assert.equal(
    masteryFor([
      attempt('math-5-fractions', 'practice', 0.95, '2026-11-12T12:00:00Z'),
      attempt('math-5-fractions', 'practice', 0.95, '2026-11-12T12:01:00Z'),
      attempt('math-5-fractions', 'practice', 0.95, '2026-11-12T12:02:00Z'),
    ]),
    'proficient',
  )
  assert.equal(
    masteryFor([
      attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z'),
      attempt('math-5-fractions', 'practice', 0.95, '2026-11-12T12:01:00Z'),
      attempt('math-5-fractions', 'study', 0.95, '2026-11-12T12:02:00Z'),
    ]),
    'mastered',
  )
  assert.equal(
    masteryFor([
      attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z'),
      attempt('math-5-fractions', 'practice', 1, '2026-11-12T12:01:00Z'),
      attempt('math-5-fractions', 'practice', 0.2, '2026-11-12T12:02:00Z'),
      attempt('math-5-fractions', 'practice', 0.2, '2026-11-12T12:03:00Z'),
    ]),
    'learning',
  )
})

test('mastery labels use the four status names', () => {
  assert.deepEqual(
    ['not-started', 'learning', 'proficient', 'mastered'].map((status) =>
      masteryLabel(status as 'not-started'),
    ),
    ['Not Started', 'Learning', 'Proficient', 'Mastered'],
  )
})

test('progress counts topics in each subject', () => {
  const rows = progressBySubject(
    [
      attempt('math-5-fractions', 'learn', 1, '2026-11-12T12:00:00Z'),
      attempt('math-5-fractions', 'practice', 1, '2026-11-12T12:01:00Z'),
      attempt('math-5-fractions', 'practice', 1, '2026-11-12T12:02:00Z'),
      attempt('math-5-decimals', 'practice', 0.8, '2026-11-12T12:03:00Z'),
      attempt('math-5-decimals', 'practice', 0.8, '2026-11-12T12:04:00Z'),
      attempt('english-5-poetry', 'learn', 0, '2026-11-12T12:05:00Z'),
    ],
    topics,
  )
  const math = rows.find((row) => row.subjectId === 'math')
  const english = rows.find((row) => row.subjectId === 'english')
  assert.equal(math?.mastered, 1)
  assert.equal(math?.proficient, 1)
  assert.equal(math?.learning, 0)
  assert.equal(math?.notStarted, 3)
  assert.equal(progressLine(math!), '1 mastered, 1 proficient')
  assert.equal(english?.learning, 1)
  assert.equal(progressLine(rows.find((row) => row.subjectId === 'science')!), 'Not Started')
})

test('elapsed time is saved in whole seconds inside the allowed range', () => {
  assert.equal(elapsedSeconds(1_000, 91_400), 90)
  assert.equal(elapsedSeconds(5_000, 1_000), 0)
  assert.equal(elapsedSeconds(0, 7_200_600), 7200)
})
