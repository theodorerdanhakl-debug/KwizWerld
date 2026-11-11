export type AvatarProps = {
  name: string
  size?: 'sm' | 'md'
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((part) => part.length > 0)
  const letters = parts.slice(0, 2).map((part) => part[0] ?? '')
  const value = letters.join('').toUpperCase()
  return value.length > 0 ? value : '?'
}

export function Avatar({ name, size = 'sm' }: AvatarProps) {
  return (
    <span className={size === 'md' ? 'avatar avatar-md' : 'avatar avatar-sm'} aria-hidden="true">
      {initials(name)}
    </span>
  )
}
