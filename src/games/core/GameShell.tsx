import { useEffect, useRef, useState } from 'react'
import { TopNav } from '../../components/TopNav'
import type { ArcadeSpec } from '../../data/arcade'
import { gradeLabel, subjectName, type Game } from '../../data/content'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useGameStatsStore } from '../../store/gameStats'
import { usePreferencesStore } from '../../store/preferences'
import type { RewardGrant } from '../../store/economy'
import { awardGameRewards } from '../../supabase/awardRewards'
import { getSupabase } from '../../supabase/client'
import { recordGameRun } from '../../supabase/gameStats'
import { GameAudio } from './audio'
import { createBridge, type BridgeHandlers, type GameBridge } from './bridge'
import { readGameColors } from './colors'
import { GameOver, type RewardState } from './GameOver'
import { PhaserMount } from './PhaserMount'
import { describeRun, isArcadeId, RUN_MS, type RunStory } from './result'

const idleHandlers: BridgeHandlers = {
  prompt: () => undefined,
  options: () => undefined,
  progress: () => undefined,
  finish: () => undefined,
}

export function GameShell({ game, spec }: { game: Game; spec: ArcadeSpec }) {
  const handlers = useRef<BridgeHandlers>(idleHandlers)
  const audioRef = useRef<GameAudio | null>(null)
  const bridgeRef = useRef<GameBridge | null>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<'play' | 'over'>('play')
  const tokenRef = useRef(0)
  const keyRef = useRef(crypto.randomUUID())
  const mountedRef = useRef(true)
  if (!audioRef.current) audioRef.current = new GameAudio()
  if (!bridgeRef.current) bridgeRef.current = createBridge(audioRef.current, handlers)
  const bridge = bridgeRef.current
  const audio = audioRef.current

  const reduced = usePrefersReducedMotion()
  const byId = useGameStatsStore((state) => state.byId)
  const stat = isArcadeId(game.id) ? byId[game.id] : undefined
  const [phase, setPhase] = useState<'play' | 'over'>('play')
  const [prompt, setPrompt] = useState(spec.rounds[0]?.prompt ?? '')
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [remaining, setRemaining] = useState(RUN_MS)
  const [story, setStory] = useState<RunStory | null>(null)
  const [grant, setGrant] = useState<RewardGrant | null>(null)
  const [rewardState, setRewardState] = useState<RewardState>('pending')
  const [saveNote, setSaveNote] = useState<string | null>(null)

  handlers.current = {
    prompt: (text) => setPrompt(text),
    options: (labels) => setOptions(labels),
    progress: (nextScore, nextCombo, remainingMs) => {
      setScore(nextScore)
      setCombo(nextCombo)
      setRemaining(remainingMs)
    },
    finish: (finalScore) => {
      if (phaseRef.current === 'over') return
      phaseRef.current = 'over'
      const token = tokenRef.current
      const key = keyRef.current
      const savedBest = isArcadeId(game.id) ? useGameStatsStore.getState().byId[game.id]?.bestScore : undefined
      const previous = savedBest ?? null
      const local = describeRun(finalScore, previous)
      setScore(local.score)
      setStory(local)
      setGrant(null)
      setSaveNote(null)
      setRewardState('pending')
      setPhase('over')
      void (async () => {
        const [recorded, nextGrant] = await Promise.all([
          recordGameRun(game.id, local.score),
          awardGameRewards(game.id, local.score, key, { announce: false }),
        ])
        if (!mountedRef.current || token !== tokenRef.current) return
        const nextStory = recorded?.story ?? local
        setStory(nextStory)
        if (nextStory.isNewBest) audio.playBest()
        setGrant(nextGrant)
        if (!getSupabase()) setRewardState('offline')
        else if (!nextGrant) setRewardState('error')
        else setRewardState('ready')
        if (recorded === null && getSupabase()) setSaveNote("Couldn't save this run.")
        if (nextGrant && (nextGrant.exp > 0 || nextGrant.diamonds > 0)) {
          bridge.handle()?.celebrate(nextGrant.exp, nextGrant.diamonds)
        }
      })()
    },
  }

  useEffect(() => {
    mountedRef.current = true
    document.title = `${game.name} · KwizWerld!`
    const applySound = () => {
      const prefs = usePreferencesStore.getState()
      audio.setEnabled(prefs.soundEffects, prefs.music)
    }
    applySound()
    const unsubscribe = usePreferencesStore.subscribe(applySound)
    const unlock = () => audio.unlock()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      mountedRef.current = false
      unsubscribe()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      audio.dispose()
    }
  }, [audio, game.name])

  useEffect(() => {
    bridge.setReduced(reduced)
  }, [bridge, reduced])

  useEffect(() => {
    const apply = () => {
      const root = shellRef.current
      if (!root) return
      bridge.setColors(readGameColors(root))
      bridge.handle()?.applyColors()
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [bridge])

  useEffect(() => {
    if (phase !== 'over') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const target = event.target
      if (target instanceof Element && target.closest('a')) return
      event.preventDefault()
      playAgain()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  function playAgain() {
    if (phaseRef.current !== 'over') return
    phaseRef.current = 'play'
    tokenRef.current += 1
    keyRef.current = crypto.randomUUID()
    setPhase('play')
    setStory(null)
    setGrant(null)
    setSaveNote(null)
    setRewardState('pending')
    setScore(0)
    setCombo(0)
    setRemaining(RUN_MS)
    setPrompt(spec.rounds[0]?.prompt ?? '')
    setOptions([])
    bridge.handle()?.restartRun()
  }

  const seconds = Math.ceil(remaining / 1000)
  const hint = spec.mode === 'choice' ? 'Tap an answer, or press 1–4.' : 'Tap the letters in order, or type them.'

  return (
    <div ref={shellRef} className="min-h-dvh bg-background text-text" data-subject={game.subject}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <TopNav />
      <main
        id="content"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl px-6 py-8 outline-none"
        onPointerDown={() => audio.unlock()}
        onKeyDown={() => audio.unlock()}
      >
        <p className="text-sm text-muted">
          {subjectName(game.subject)} · {gradeLabel(game.grade)}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{game.name}</h1>
        {phase === 'play' ? (
          <div className="game-hud">
            <p className="game-prompt">{prompt}</p>
            <ol className="sr-only">
              {options.map((label, index) => (
                <li key={`${index}-${label}`}>
                  {index + 1}. {label}
                </li>
              ))}
            </ol>
            <div
              className="game-meters"
              aria-label={`Score ${score}. ${combo > 1 ? `Combo ${combo}. ` : ''}${seconds} seconds left.`}
            >
              <span className="game-meter">{score}</span>
              {combo > 1 ? (
                <span key={combo} className={combo >= 4 ? 'game-combo game-combo-hot' : 'game-combo'}>
                  ×{combo}
                </span>
              ) : null}
              <span className="game-meter">{seconds}s</span>
              <span className="game-meter">{stat ? `Best ${stat.bestScore}` : 'Best —'}</span>
            </div>
          </div>
        ) : (
          <div className="game-hud game-hud-quiet" />
        )}
        <p className="sr-only" aria-live="polite">
          {phase === 'play' ? prompt : ''}
        </p>
        <div className="game-stage" tabIndex={0} aria-label={game.name}>
          <PhaserMount spec={spec} bridge={bridge} />
          {phase === 'over' ? (
            <GameOver
              score={score}
              story={story}
              grant={grant}
              rewardState={rewardState}
              saveNote={saveNote}
              onAgain={playAgain}
            />
          ) : null}
        </div>
        {phase === 'play' ? <p className="mt-4 text-center text-sm text-muted">{hint}</p> : null}
      </main>
    </div>
  )
}

export default GameShell
