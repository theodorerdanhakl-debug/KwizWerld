import type { ModeId, SubjectId } from './content'

export type Recommendation = {
  id: string
  title: string
  mode: ModeId
}

const placeholders: Record<SubjectId, readonly Recommendation[]> = {
  math: [
    { id: 'math-place-value', title: 'Place value', mode: 'learn' },
    { id: 'math-addition-facts', title: 'Addition facts', mode: 'study' },
    { id: 'math-mixed-set', title: 'A mixed set', mode: 'practice' },
  ],
  english: [
    { id: 'english-short-story', title: 'A short story', mode: 'learn' },
    { id: 'english-sight-words', title: 'Sight words', mode: 'study' },
    { id: 'english-writing-prompt', title: 'A writing prompt', mode: 'practice' },
  ],
  geography: [
    { id: 'geography-compass', title: 'The compass', mode: 'learn' },
    { id: 'geography-capitals', title: 'Capital cities', mode: 'study' },
    { id: 'geography-map', title: 'Read a map', mode: 'practice' },
  ],
  science: [
    { id: 'science-living-things', title: 'Living things', mode: 'learn' },
    { id: 'science-water-cycle', title: 'The water cycle', mode: 'study' },
    { id: 'science-quick-check', title: 'A quick check', mode: 'practice' },
  ],
  history: [
    { id: 'history-timeline', title: 'A timeline', mode: 'learn' },
    { id: 'history-people', title: 'Famous people', mode: 'study' },
    { id: 'history-then-now', title: 'Then and now', mode: 'practice' },
  ],
}

export function getPlaceholderRecommendations(subjectId: SubjectId): readonly Recommendation[] {
  return placeholders[subjectId].slice(0, 3)
}
