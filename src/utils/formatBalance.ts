export function formatBalance(value: number | null): string {
  if (value === null) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}
