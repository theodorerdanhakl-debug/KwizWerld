import { create } from 'zustand'

export const THEME_KEY = 'kwizwerld.theme.v1'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

type ThemeState = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Private mode can block storage. Fall back to the system theme.
  }
  return 'system'
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? systemTheme() : preference
}

export function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function isThemePreference(value: string): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

function publish(preference: ThemePreference): void {
  const resolved = resolveTheme(preference)
  applyTheme(resolved)
  useThemeStore.setState({ preference, resolved })
}

export const useThemeStore = create<ThemeState>(() => ({
  preference: 'system',
  resolved: 'light',
  setPreference: (preference) => {
    try {
      localStorage.setItem(THEME_KEY, preference)
    } catch {
      // The class still updates for this visit when storage is blocked.
    }
    publish(preference)
  },
}))

let listening = false

export function initTheme(): void {
  publish(readPreference())
  if (listening) return
  listening = true
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().preference === 'system') publish('system')
  })
}
