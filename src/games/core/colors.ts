export type GameColors = {
  background: string
  surface: string
  text: string
  muted: string
  border: string
  accent: string
  onAccent: string
  exp: string
  diamond: string
}

export function readGameColors(root: HTMLElement): GameColors {
  const style = getComputedStyle(root)
  const read = (name: string, depth = 0): string => {
    const value = style.getPropertyValue(name).trim()
    const nested = value.match(/^var\(\s*(--[\w-]+)\s*\)$/)
    if (nested && depth < 4) return read(nested[1], depth + 1)
    return value || 'CanvasText'
  }
  return {
    background: read('--background'),
    surface: read('--surface'),
    text: read('--text'),
    muted: read('--muted-text'),
    border: read('--border'),
    accent: read('--accent'),
    onAccent: read('--on-accent'),
    exp: read('--exp'),
    diamond: read('--diamond'),
  }
}

export function cssColorToHex(color: string): number {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i)
  if (hex) return Number.parseInt(hex[1], 16)
  const short = color.trim().match(/^#([0-9a-f]{3})$/i)
  if (short) {
    const [red, green, blue] = short[1].split('')
    return Number.parseInt(`${red}${red}${green}${green}${blue}${blue}`, 16)
  }
  const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (!match) return 0xffffff
  const red = Math.max(0, Math.min(255, Math.round(Number(match[1]))))
  const green = Math.max(0, Math.min(255, Math.round(Number(match[2]))))
  const blue = Math.max(0, Math.min(255, Math.round(Number(match[3]))))
  return (red << 16) + (green << 8) + blue
}
