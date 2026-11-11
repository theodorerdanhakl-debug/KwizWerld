export function cn(...parts: Array<string | false | null | undefined>): string {
  const classes: string[] = []
  for (const part of parts) {
    if (part) classes.push(part)
  }
  return classes.join(' ')
}
