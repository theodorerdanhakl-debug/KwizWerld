export type ChoiceRound = {
  kind: 'choice'
  prompt: string
  choices: readonly string[]
  answer: string
}

export type OrderRound = {
  kind: 'order'
  prompt: string
  word: string
}

export type ArcadeRound = ChoiceRound | OrderRound

export type ArcadeSpec = {
  id: string
  mode: 'choice' | 'order'
  rounds: readonly ArcadeRound[]
}

const SPECS: Record<string, ArcadeSpec> = {
  'sum-sprint': {
    id: 'sum-sprint',
    mode: 'choice',
    rounds: [
      { kind: 'choice', prompt: '4 + 3', choices: ['7', '6', '8'], answer: '7' },
      { kind: 'choice', prompt: '9 + 5', choices: ['14', '13', '15'], answer: '14' },
      { kind: 'choice', prompt: '6 + 6', choices: ['12', '10', '11'], answer: '12' },
      { kind: 'choice', prompt: '8 + 2', choices: ['10', '9', '12'], answer: '10' },
      { kind: 'choice', prompt: '7 + 4', choices: ['11', '10', '12'], answer: '11' },
      { kind: 'choice', prompt: '5 + 8', choices: ['13', '12', '14'], answer: '13' },
      { kind: 'choice', prompt: '3 + 9', choices: ['12', '11', '13'], answer: '12' },
      { kind: 'choice', prompt: '10 + 6', choices: ['16', '15', '17'], answer: '16' },
    ],
  },
  'word-trail': {
    id: 'word-trail',
    mode: 'order',
    rounds: [
      { kind: 'order', prompt: 'Spell bird', word: 'bird' },
      { kind: 'order', prompt: 'Spell moon', word: 'moon' },
      { kind: 'order', prompt: 'Spell star', word: 'star' },
      { kind: 'order', prompt: 'Spell tree', word: 'tree' },
      { kind: 'order', prompt: 'Spell frog', word: 'frog' },
      { kind: 'order', prompt: 'Spell lake', word: 'lake' },
      { kind: 'order', prompt: 'Spell wind', word: 'wind' },
      { kind: 'order', prompt: 'Spell ship', word: 'ship' },
    ],
  },
  'map-hop': {
    id: 'map-hop',
    mode: 'choice',
    rounds: [
      { kind: 'choice', prompt: 'Hop north', choices: ['North', 'East', 'South', 'West'], answer: 'North' },
      { kind: 'choice', prompt: 'Hop east', choices: ['East', 'North', 'South', 'West'], answer: 'East' },
      { kind: 'choice', prompt: 'The opposite of north', choices: ['South', 'East', 'West', 'North'], answer: 'South' },
      { kind: 'choice', prompt: 'A sandy place', choices: ['Desert', 'Ocean', 'Forest', 'Lake'], answer: 'Desert' },
      { kind: 'choice', prompt: 'Water all around', choices: ['Island', 'Valley', 'Hill', 'Plain'], answer: 'Island' },
      { kind: 'choice', prompt: 'Where a river meets the sea', choices: ['Mouth', 'Peak', 'Dune', 'Ridge'], answer: 'Mouth' },
      { kind: 'choice', prompt: 'Hop west', choices: ['West', 'East', 'North', 'South'], answer: 'West' },
      { kind: 'choice', prompt: 'A high rocky top', choices: ['Peak', 'Bay', 'Plain', 'Port'], answer: 'Peak' },
    ],
  },
  'lab-notes': {
    id: 'lab-notes',
    mode: 'choice',
    rounds: [
      { kind: 'choice', prompt: 'A plant makes food with', choices: ['Sunlight', 'Shadows', 'Rocks', 'Sound'], answer: 'Sunlight' },
      { kind: 'choice', prompt: 'Ice is water that is', choices: ['Frozen', 'Boiling', 'Metal', 'Gas'], answer: 'Frozen' },
      { kind: 'choice', prompt: 'A magnet pulls', choices: ['Iron', 'Wood', 'Paper', 'Glass'], answer: 'Iron' },
      { kind: 'choice', prompt: 'We measure heat with a', choices: ['Thermometer', 'Ruler', 'Clock', 'Map'], answer: 'Thermometer' },
      { kind: 'choice', prompt: 'The Earth spins once each', choices: ['Day', 'Month', 'Year', 'Minute'], answer: 'Day' },
      { kind: 'choice', prompt: 'Roots take in', choices: ['Water', 'Light', 'Sound', 'Wind'], answer: 'Water' },
      { kind: 'choice', prompt: 'A solid keeps its', choices: ['Shape', 'Steam', 'Echo', 'Glow'], answer: 'Shape' },
      { kind: 'choice', prompt: 'We see because of', choices: ['Light', 'Gravity', 'Wind', 'Salt'], answer: 'Light' },
    ],
  },
  'time-post': {
    id: 'time-post',
    mode: 'choice',
    rounds: [
      { kind: 'choice', prompt: 'Which came first?', choices: ['The wheel', 'The phone'], answer: 'The wheel' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['A sailboat', 'An airplane'], answer: 'A sailboat' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['Writing', 'Television'], answer: 'Writing' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['A castle', 'A skyscraper'], answer: 'A castle' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['Horses', 'Cars'], answer: 'Horses' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['Farms', 'Factories'], answer: 'Farms' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['Letters', 'Email'], answer: 'Letters' },
      { kind: 'choice', prompt: 'Which came first?', choices: ['Candles', 'Light bulbs'], answer: 'Candles' },
    ],
  },
}

function checked(spec: ArcadeSpec): ArcadeSpec {
  for (const round of spec.rounds) {
    if (round.kind !== spec.mode) throw new Error(`Mixed round in ${spec.id}`)
    if (round.kind === 'choice') {
      if (round.choices.length < 2 || round.choices.length > 4) throw new Error(`Choices in ${spec.id}`)
      if (!round.choices.includes(round.answer)) throw new Error(`Answer missing in ${spec.id}`)
    } else if (round.word.length < 2 || round.word !== round.word.toLowerCase()) {
      throw new Error(`Word in ${spec.id}`)
    }
  }
  return spec
}

for (const spec of Object.values(SPECS)) checked(spec)

export function getArcade(gameId: string): ArcadeSpec | null {
  return SPECS[gameId] ?? null
}
