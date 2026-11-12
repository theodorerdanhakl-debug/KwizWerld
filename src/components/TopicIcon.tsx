import type { TopicIcon as TopicIconName } from '../data/curriculum'

export type TopicIconProps = {
  name: TopicIconName
}

const paths: Record<TopicIconName, string> = {
  count: 'M16 32h2M24 32h2M32 32h2M18 22h2M26 22h2M22 14h2',
  shapes: 'M24 10 40 38H8Z',
  pattern: 'M10 24h6M22 24h6M34 24h6M10 16h6M22 16h6',
  plus: 'M24 12v24M12 24h24',
  minus: 'M12 24h24',
  place: 'M12 14h10v10H12zM26 14h10v10H26zM12 28h10v8H12zM26 28h10v8H26z',
  clock: 'M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28zM24 16v9l6 3',
  times: 'M16 16l16 16M32 16 16 32',
  divide: 'M14 24h20M24 16h.1M24 32h.1',
  fraction: 'M10 24h28M16 14h12M20 34h12',
  order: 'M14 16h20M14 24h14M14 32h8',
  equation: 'M12 20h10M28 20h8M12 28h8M26 28h10M18 16v16',
  function: 'M10 32c8-18 10-18 14-8s6 10 14-12',
  chart: 'M12 34V22M24 34V14M36 34V26',
  phonics: 'M16 34V16M24 34V12M32 34V18',
  book: 'M10 14h12v22H10zM26 14h12v22H26zM22 14v22',
  article: 'M14 14h20M14 22h20M14 30h12',
  poem: 'M16 14c6 4 6 8 0 12M24 18c6 4 6 8 0 12M18 34h12',
  pencil: 'M30 10 38 18 18 38H10v-8zM28 14l6 6',
  grammar: 'M14 16h20M14 24h16M18 32h8M24 12v24',
  words: 'M14 18h20M14 26h14M14 34h8',
  speech: 'M12 14h24v14H20l-8 6z',
  map: 'M10 16l10-4 8 4 10-4v22l-10 4-8-4-10 4zM20 12v22M28 16v22',
  pin: 'M24 40s10-12 10-18a10 10 0 1 0-20 0c0 6 10 18 10 18zM24 20h.1',
  globe: 'M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28zM10 24h28M24 10c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14z',
  compass: 'M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28zM24 18l4 10-4-2-4 2z',
  land: 'M8 32 18 16l8 10 6-6 8 12z',
  city: 'M12 36V20h8v16M20 36V14h8v22M28 36V22h8v14',
  senses: 'M8 24s6-8 16-8 16 8 16 8-6 8-16 8-16-8-16-8zM24 24h.1',
  leaf: 'M34 14C22 14 12 24 12 36c12 0 22-10 22-22zM16 32c4-6 10-10 16-14',
  flask: 'M20 12h8M20 12v8L12 36h24L28 20v-8',
  atom: 'M24 24h.1M24 24a12 6 0 1 0 0 .1M24 24a6 12 0 1 0 .1 0',
  bolt: 'M26 8 14 26h10l-2 14 12-18H24z',
  sun: 'M24 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM24 8v4M24 36v4M8 24h4M36 24h4M12 12l3 3M33 33l3 3M36 12l-3 3M15 33l-3 3',
  body: 'M24 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM16 38c1-8 4-12 8-12s7 4 8 12',
  people: 'M16 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM30 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10 36c1-6 3-8 6-8s5 2 6 8M26 36c1-6 3-8 6-8s5 2 6 8',
  scroll: 'M14 14h18a4 4 0 0 1 0 8H16M14 22h16a4 4 0 0 1 0 8H12',
  columns: 'M14 36V18M34 36V18M14 18h20M16 18c0-6 16-6 16 0',
  ship: 'M8 28h32l-4 8H12zM24 12v16M24 16h8',
  flag: 'M14 10v28M14 12h18l-4 6 4 6H14',
}

export function TopicIcon({ name }: TopicIconProps) {
  return (
    <svg className="topic-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
