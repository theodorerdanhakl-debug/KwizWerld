import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Confetti, RewardBurst } from '../components/RewardBurst'
import { LessonFigure } from '../components/LessonFigure'
import { ProgressBar } from '../components/ProgressBar'
import type { TopicActivity } from '../data/activities'
import { recordAttempt } from '../supabase/attempts'
import { awardRewards } from '../supabase/awardRewards'
import { cn } from '../utils/cn'
import { elapsedSeconds } from '../utils/recommendations'

export type LearnSessionProps = {
  activity: TopicActivity
  backHref: string
}

export function LearnSession({ activity, backHref }: LearnSessionProps) {
  const steps = activity.learn.steps
  const total = steps.length + 1
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [done, setDone] = useState(false)
  const awarded = useRef(false)
  const rewardKey = useRef(crypto.randomUUID())
  const startedAt = useRef(Date.now())
  const step = steps[index]
  const onCheck = index >= steps.length
  const correct = choice === activity.learn.check.answer

  function finish() {
    if (awarded.current) return
    awarded.current = true
    setDone(true)
    const score = correct ? 1 : 0
    void recordAttempt({
      idempotencyKey: rewardKey.current,
      topicId: activity.topicId,
      mode: 'learn',
      score,
      durationSeconds: elapsedSeconds(startedAt.current, Date.now()),
    })
    void awardRewards('learn', {
      idempotencyKey: rewardKey.current,
      topicId: activity.topicId,
      score,
    })
  }

  if (done) {
    return (
      <div>
        <Confetti show />
        <p className="text-lg">You finished this lesson.</p>
        <div className="mt-8">
          <Button variant="primary" href={backHref}>
            Back to lessons
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar value={index + 1} max={total} label="Lesson" />
      {step ? (
        <div className="mt-10">
          <p className="text-lg text-pretty">{step.text}</p>
          {step.image ? (
            <div className="mt-8">
              <LessonFigure name={step.image} />
            </div>
          ) : null}
          {step.example ? <p className="lesson-example">{step.example}</p> : null}
        </div>
      ) : (
        <div className={cn('relative mt-10', checked && correct && 'reward-pulse')}>
          <RewardBurst show={checked && correct} />
          <p className="text-lg text-pretty">{activity.learn.check.prompt}</p>
          <div className="mt-6 flex flex-col gap-3" role="group" aria-label="Choices">
            {activity.learn.check.choices.map((option, optionIndex) => {
              const selected = choice === optionIndex
              const showCorrect = checked && optionIndex === activity.learn.check.answer
              const showWrong = checked && selected && !correct
              return (
                <button
                  key={option}
                  type="button"
                  className={cn('choice', selected && 'is-selected', showCorrect && 'is-correct', showWrong && 'is-wrong')}
                  aria-pressed={selected}
                  disabled={checked}
                  onClick={() => setChoice(optionIndex)}
                >
                  {option}
                </button>
              )
            })}
          </div>
          {checked ? (
            <p className="mt-6" role="status">
              <span className={correct ? 'reward-note' : 'text-muted'}>{correct ? 'Correct.' : 'Not quite.'}</span>{' '}
              <span className="text-muted">{activity.learn.check.explanation}</span>
            </p>
          ) : null}
        </div>
      )}
      <div className="mt-10 flex items-center justify-between gap-4">
        {index > 0 ? (
          <Button
            onClick={() => {
              setIndex((current) => current - 1)
              setChecked(false)
            }}
          >
            Back
          </Button>
        ) : (
          <span />
        )}
        {onCheck && !checked ? (
          <Button variant="primary" disabled={choice === null} onClick={() => setChecked(true)}>
            Check
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              if (onCheck) finish()
              else setIndex((current) => current + 1)
            }}
          >
            {onCheck ? 'Finish' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  )
}
