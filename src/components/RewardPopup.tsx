import { motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useCountUp } from '../hooks/useCountUp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useEconomyStore } from '../store/economy'
import { Button } from './Button'
import { Confetti } from './RewardBurst'

const FLY_OFFSETS = [-12, -6, 0, 6, 12]

export function RewardPopup() {
  const grant = useEconomyStore((state) => state.grant)
  const dismissGrant = useEconomyStore((state) => state.dismissGrant)
  const reduce = usePrefersReducedMotion()
  const titleId = useId()
  const popupRef = useRef<HTMLDivElement>(null)
  const diamondRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!grant) return
    popupRef.current?.querySelector('button')?.focus()
    const locked = [...document.body.children].filter(
      (node) => node instanceof HTMLElement && !node.hasAttribute('data-reward-layer'),
    )
    for (const node of locked) node.setAttribute('inert', '')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissGrant()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      for (const node of locked) node.removeAttribute('inert')
    }
  }, [grant, dismissGrant])

  if (!grant) return null

  const subject = document.querySelector('[data-subject]')?.getAttribute('data-subject')
  const quiet = grant.exp === 0 && grant.diamonds === 0
  const shownExp = grant.exp

  return createPortal(
    <>
      <div className="reward-scrim" data-reward-layer />
      <div
        className="reward-popup"
        data-reward-layer
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...(subject ? { 'data-subject': subject } : {})}
      >
        {grant.leveledUp ? <Confetti show className="reward-confetti" /> : null}
        <motion.div
          ref={popupRef}
          className="reward-popup-card"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id={titleId} className="text-3xl">
            {quiet ? "That's the hour's rewards." : grant.leveledUp ? `Level ${grant.level}` : 'You earned a reward'}
          </h2>
          {grant.leveledUp ? <p className="mt-3 text-muted">You reached a new level.</p> : null}
          {shownExp > 0 ? <ExpGain amount={shownExp} /> : null}
          {grant.diamonds > 0 ? (
            <p ref={diamondRef} className="reward-gain-diamond">
              +{grant.diamonds} {grant.diamonds === 1 ? 'diamond' : 'diamonds'}
            </p>
          ) : null}
          <div className="mt-8">
            <Button variant="primary" onClick={dismissGrant}>
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
      {grant.diamonds > 0 ? <DiamondFly origin={diamondRef} reduce={reduce} /> : null}
    </>,
    document.body,
  )
}

function ExpGain({ amount }: { amount: number }) {
  const reduce = usePrefersReducedMotion()
  const shown = useCountUp(amount, { reduce, from: reduce ? amount : 0 })
  return <p className="reward-gain-exp">+{shown ?? 0} EXP</p>
}

type DiamondFlyProps = {
  origin: RefObject<HTMLParagraphElement | null>
  reduce: boolean
}

function DiamondFly({ origin, reduce }: DiamondFlyProps) {
  const [flight, setFlight] = useState<{ left: number; top: number; x: number; y: number } | null>(null)

  useEffect(() => {
    if (reduce) return
    const frame = window.requestAnimationFrame(() => {
      const start = origin.current?.getBoundingClientRect()
      const end = document.querySelector('[data-reward-diamond]')?.getBoundingClientRect()
      if (!start || !end) return
      setFlight({
        left: start.left + start.width / 2,
        top: start.top + start.height / 2,
        x: end.left + end.width / 2 - (start.left + start.width / 2),
        y: end.top + end.height / 2 - (start.top + start.height / 2),
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [origin, reduce])

  if (!flight) return null

  return createPortal(
    <div data-reward-layer aria-hidden="true">
      {FLY_OFFSETS.map((offset) => (
        <motion.span
          key={offset}
          className="reward-fly"
          style={{ left: flight.left, top: flight.top }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: flight.x + offset, y: flight.y, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>,
    document.body,
  )
}
