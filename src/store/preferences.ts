import { create } from 'zustand'

type PreferencesState = {
  reducedMotion: boolean
  soundEffects: boolean
  music: boolean
}

export const usePreferencesStore = create<PreferencesState>(() => ({
  reducedMotion: false,
  soundEffects: true,
  music: true,
}))

export function applyReducedMotion(enabled: boolean): void {
  document.documentElement.classList.toggle('reduce-motion', enabled)
  usePreferencesStore.setState({ reducedMotion: enabled })
}

export function applySoundPreferences(soundEffects: boolean, music: boolean): void {
  usePreferencesStore.setState({ soundEffects, music })
}
