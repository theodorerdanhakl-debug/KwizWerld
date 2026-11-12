import { useEffect, useRef, useState } from 'react'

export type UseCountUpOptions = {
  reduce: boolean
  from?: number
}

export function useCountUp(target: number | null, options: UseCountUpOptions): number | null {
  const { reduce, from } = options
  const [value, setValue] = useState<number | null>(from !== undefined ? from : target)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    if (target === null) {
      setValue(null)
      return
    }
    const startValue = valueRef.current ?? target
    if (reduce || startValue === target) {
      setValue(target)
      return
    }
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 280)
      setValue(Math.round(startValue + (target - startValue) * t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, reduce])

  return value
}
