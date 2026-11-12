import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Confetti, RewardBurst } from '../components/RewardBurst'
import { ProgressBar } from '../components/ProgressBar'
import {
  pickNextQuestion,
  typedAnswerMatches,
  type PracticeQuestion,
  type TopicActivity,
} from '../data/activities'
import { awardRewards } from '../supabase/awardRewards'
import { cn } from '../utils/cn'

export type PracticeSessionProps = {
  activity: TopicActivity
  backHref: string
}

type Phase = 'ask' | 'feedback' | 'results'

function deal(questions: readonly PracticeQuestion[]): { current: PracticeQuestion; rest: PracticeQuestion[] } {
  const current = pickNextQuestion(questions, [])
  return { current, rest: questions.filter((question) => question.id !== current.id) }
}

function isRight(question: PracticeQuestion, choice: number | null, typed: string): boolean {
  if (question.type === 'typed') return typedAnswerMatches(question, typed)
  if (question.type === 'boolean') return choice !== null && (choice === 0) === question.answer
  return choice === question.answer
}

export function PracticeSession({ activity, backHref }: PracticeSessionProps) {
  const opening = deal(activity.practice.questions)
  const [current, setCurrent] = useState(opening.current)
  const [rest, setRest] = useState(opening.rest)
  const [phase, setPhase] = useState<Phase>('ask')
  const [choice, setChoice] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [correctNow, setCorrectNow] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const recentRef = useRef<boolean[]>([])
  const [missed, setMissed] = useState<PracticeQuestion[]>([])
  const [roundSize, setRoundSize] = useState(activity.practice.questions.length)
  const awarded = useRef(false)
  const rewardKey = useRef(crypto.randomUUID())
  const total = roundSize
  const canCheck = current.type === 'typed' ? typed.trim().length > 0 : choice !== null

  function award(score: number) {
    if (awarded.current) return
    awarded.current = true
    void awardRewards('practice', {
      idempotencyKey: rewardKey.current,
      topicId: activity.topicId,
      score,
    })
  }

  function check() {
    if (phase !== 'ask') return
    const right = isRight(current, choice, typed)
    const nextStreak = right ? streak + 1 : 0
    setCorrectNow(right)
    setStreak(nextStreak)
    setBest((value) => Math.max(value, nextStreak))
    setCorrectCount((value) => value + (right ? 1 : 0))
    setAnswered((value) => value + 1)
    recentRef.current = [...recentRef.current, right]
    if (!right) setMissed((value) => [...value, current])
    setPhase('feedback')
  }

  function continueRound() {
    if (rest.length === 0) {
      award(total === 0 ? 0 : correctCount / total)
      setPhase('results')
      return
    }
    const next = pickNextQuestion(rest, recentRef.current)
    setCurrent(next)
    setRest(rest.filter((question) => question.id !== next.id))
    setChoice(null)
    setTyped('')
    setPhase('ask')
  }

  function retryMissed() {
    const nextDeal = deal(missed)
    rewardKey.current = crypto.randomUUID()
    awarded.current = false
    setRoundSize(missed.length)
    setCurrent(nextDeal.current)
    setRest(nextDeal.rest)
    setMissed([])
    setCorrectCount(0)
    setAnswered(0)
    setStreak(0)
    setBest(0)
    recentRef.current = []
    setChoice(null)
    setTyped('')
    setPhase('ask')
  }

  if (phase === 'results') {
    return (
      <div>
        <Confetti show />
        <p className="text-lg">
          {correctCount} of {total} correct
        </p>
        {best > 1 ? <p className="mt-3 text-muted">Best streak {best}.</p> : null}
        {missed.length > 0 ? (
          <ul className="mt-8 flex flex-col gap-3" aria-label="Missed questions">
            {missed.map((question) => (
              <li key={question.id} className="text-muted">
                {question.prompt}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-muted">You answered every question.</p>
        )}
        <div className="mt-10">
          {missed.length > 0 ? (
            <Button variant="primary" onClick={retryMissed}>
              Retry missed questions
            </Button>
          ) : (
            <Button variant="primary" href={backHref}>
              Back to practice
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar value={answered} max={total} label="Questions" />
      {streak > 0 ? <p className="mt-4 text-sm text-muted">Streak {streak}</p> : null}
      <div className={cn('relative mt-10', phase === 'feedback' && correctNow && 'reward-pulse')}>
        <RewardBurst show={phase === 'feedback' && correctNow} />
        <p className="text-lg text-pretty">{current.prompt}</p>
        {current.type === 'typed' ? (
          <div className="mt-6">
            <Field label="Your answer">
              {({ id }) => (
                <input
                  id={id}
                  className="field-input"
                  value={typed}
                  disabled={phase === 'feedback'}
                  autoComplete="off"
                  onChange={(event) => setTyped(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && typed.trim().length > 0) {
                      event.preventDefault()
                      check()
                    }
                  }}
                />
              )}
            </Field>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3" role="group" aria-label="Choices">
            {current.choices.map((option, optionIndex) => {
              const selected = choice === optionIndex
              const rightIndex = current.type === 'boolean' ? (current.answer === true ? 0 : 1) : current.answer
              const showCorrect = phase === 'feedback' && optionIndex === rightIndex
              const showWrong = phase === 'feedback' && selected && !correctNow
              return (
                <button
                  key={option}
                  type="button"
                  className={cn('choice', selected && 'is-selected', showCorrect && 'is-correct', showWrong && 'is-wrong')}
                  aria-pressed={selected}
                  disabled={phase === 'feedback'}
                  onClick={() => setChoice(optionIndex)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}
        {phase === 'feedback' ? (
          <p className="mt-6" role="status">
            <span className={correctNow ? 'reward-note' : 'text-muted'}>
              {correctNow ? (streak > 1 ? `Combo ${streak}.` : 'Correct.') : 'Not quite.'}
            </span>{' '}
            <span className="text-muted">{current.explanation}</span>
          </p>
        ) : null}
      </div>
      <div className="mt-10 flex justify-end">
        {phase === 'ask' ? (
          <Button variant="primary" disabled={!canCheck} onClick={check}>
            Check
          </Button>
        ) : (
          <Button variant="primary" onClick={continueRound}>
            {rest.length === 0 ? 'See results' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  )
}
