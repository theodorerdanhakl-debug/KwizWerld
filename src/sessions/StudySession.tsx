import { motion } from 'framer-motion'
import { useRef, useState, type PointerEvent } from 'react'
import { Button } from '../components/Button'
import { Confetti } from '../components/RewardBurst'
import { ProgressBar } from '../components/ProgressBar'
import type { Flashcard, TopicActivity } from '../data/activities'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { awardRewards } from '../supabase/awardRewards'

export type StudySessionProps = {
  activity: TopicActivity
  backHref: string
}

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = next[index]
    next[index] = next[swap] as T
    next[swap] = current as T
  }
  return next
}

export function StudySession({ activity, backHref }: StudySessionProps) {
  const reduce = usePrefersReducedMotion()
  const cards = activity.study.cards
  const [queue, setQueue] = useState<Flashcard[]>(() => shuffle(cards))
  const [flipped, setFlipped] = useState(false)
  const [gotIt, setGotIt] = useState(0)
  const [done, setDone] = useState(false)
  const missed = useRef(new Set<string>())
  const awarded = useRef(false)
  const rewardKey = useRef(crypto.randomUUID())
  const drag = useRef<{ x: number; y: number } | null>(null)
  const card = queue[0]

  function complete() {
    if (awarded.current) return
    awarded.current = true
    setDone(true)
    const score = cards.length === 0 ? 0 : (cards.length - missed.current.size) / cards.length
    void awardRewards('study', {
      idempotencyKey: rewardKey.current,
      topicId: activity.topicId,
      score,
    })
  }

  function rate(known: boolean) {
    if (!card) return
    if (!known) missed.current.add(card.id)
    const rest = queue.slice(1)
    setFlipped(false)
    if (known) {
      setGotIt((current) => current + 1)
      setQueue(rest)
      if (rest.length === 0) complete()
      return
    }
    const insertAt = Math.min(2, rest.length)
    const next = [...rest]
    next.splice(insertAt, 0, card)
    setQueue(next)
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    drag.current = { x: event.clientX, y: event.clientY }
  }

  function onPointerUp(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current
    drag.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      setFlipped((current) => !current)
      return
    }
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy)) return
    rate(dx > 0)
  }

  if (done) {
    return (
      <div>
        <Confetti show />
        <ProgressBar value={cards.length} max={cards.length} label="Got it" />
        <p className="mt-10 text-lg">You know this deck.</p>
        <div className="mt-8">
          <Button variant="primary" href={backHref}>
            Back to study
          </Button>
        </div>
      </div>
    )
  }

  if (!card) return null

  return (
    <div>
      <ProgressBar value={gotIt} max={cards.length} label="Got it" />
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => {
            setFlipped(false)
            setQueue((current) => shuffle(current))
          }}
        >
          Shuffle
        </Button>
      </div>
      <div className="flash-scene mt-6">
        {reduce ? (
          <button
            type="button"
            className="flash-face flash-static"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null
            }}
          >
            {flipped ? card.back : card.front}
          </button>
        ) : (
          <motion.button
            type="button"
            className="flash-inner"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null
            }}
          >
            <span className="flash-face" aria-hidden={flipped}>
              {card.front}
            </span>
            <span className="flash-face flash-back" aria-hidden={!flipped}>
              {card.back}
            </span>
          </motion.button>
        )}
      </div>
      <p className="mt-4 text-center text-sm text-muted">{flipped ? 'Swipe right if you know it.' : 'Tap the card to flip it.'}</p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button onClick={() => rate(false)}>Still learning</Button>
        <Button variant="primary" onClick={() => rate(true)}>
          Got it
        </Button>
      </div>
    </div>
  )
}
