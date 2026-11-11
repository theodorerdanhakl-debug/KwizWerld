import { useThemeStore } from '../store/theme'

export function useTheme() {
  const preference = useThemeStore((state) => state.preference)
  const resolved = useThemeStore((state) => state.resolved)
  const setPreference = useThemeStore((state) => state.setPreference)
  return { preference, resolved, setPreference }
}
