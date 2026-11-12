import { useEffect, useState } from 'react'

function readHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useHoverCapable(): boolean {
  const [capable, setCapable] = useState(readHover)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onChange = () => {
      setCapable(media.matches)
    }
    onChange()
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [])

  return capable
}
