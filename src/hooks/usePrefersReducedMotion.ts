import { useEffect, useState } from 'react'
import { usePreferencesStore } from '../store/preferences'

function readReduced(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePrefersReducedMotion(): boolean {
  const userReduced = usePreferencesStore((state) => state.reducedMotion)
  const [osReduced, setOsReduced] = useState(readReduced)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      setOsReduced(media.matches)
    }
    onChange()
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [])

  return userReduced || osReduced
}
