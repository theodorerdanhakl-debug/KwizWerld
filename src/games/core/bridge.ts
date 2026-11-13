import type { GameAudio } from './audio'
import type { GameColors } from './colors'

export type BridgeState = {
  reducedMotion: boolean
  colors: GameColors
}

export type BridgeHandlers = {
  prompt: (text: string) => void
  options: (labels: string[]) => void
  progress: (score: number, combo: number, remainingMs: number) => void
  finish: (score: number) => void
}

export type ArcadeHandle = {
  restartRun: () => void
  applyColors: () => void
  celebrate: (exp: number, diamonds: number) => void
}

export type GameBridge = {
  read: () => BridgeState
  setReduced: (value: boolean) => void
  setColors: (colors: GameColors) => void
  prompt: (text: string) => void
  options: (labels: string[]) => void
  progress: (score: number, combo: number, remainingMs: number) => void
  finish: (score: number) => void
  audio: GameAudio
  attach: (handle: ArcadeHandle | null) => void
  handle: () => ArcadeHandle | null
}

const EMPTY_COLORS: GameColors = {
  background: 'canvas',
  surface: 'canvas',
  text: 'canvastext',
  muted: 'canvastext',
  border: 'canvastext',
  accent: 'canvastext',
  onAccent: 'canvas',
  exp: 'canvastext',
  diamond: 'canvastext',
}

export function createBridge(
  audio: GameAudio,
  handlers: { current: BridgeHandlers },
): GameBridge {
  const state: BridgeState = { reducedMotion: false, colors: EMPTY_COLORS }
  let handle: ArcadeHandle | null = null
  return {
    read: () => state,
    setReduced(value) {
      state.reducedMotion = value
    },
    setColors(colors) {
      state.colors = colors
    },
    prompt(text) {
      handlers.current.prompt(text)
    },
    options(labels) {
      handlers.current.options(labels)
    },
    progress(score, combo, remainingMs) {
      handlers.current.progress(score, combo, remainingMs)
    },
    finish(score) {
      handlers.current.finish(score)
    },
    audio,
    attach(next) {
      handle = next
    },
    handle: () => handle,
  }
}
