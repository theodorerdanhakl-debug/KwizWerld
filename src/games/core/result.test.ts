import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  describeRun,
  parseGameRun,
  parseGameStat,
  playsLabel,
  pointsForCombo,
} from './result.ts'

test('the first run is a new best', () => {
  const story = describeRun(12, null)
  assert.equal(story.isNewBest, true)
  assert.equal(story.best, 12)
  assert.equal(story.previousBest, null)
  assert.equal(story.nearMiss, null)
})

test('a higher score is a new best', () => {
  const story = describeRun(51, 50)
  assert.equal(story.isNewBest, true)
  assert.equal(story.best, 51)
  assert.equal(story.nearMiss, null)
})

test('a tie is not a new best or a near miss', () => {
  const story = describeRun(40, 40)
  assert.equal(story.isNewBest, false)
  assert.equal(story.best, 40)
  assert.equal(story.nearMiss, null)
})

test('near misses name the gap', () => {
  assert.equal(describeRun(47, 50).nearMiss, 'Only 3 points from your best!')
  assert.equal(describeRun(49, 50).nearMiss, 'Only 1 point from your best!')
  assert.equal(describeRun(45, 50).nearMiss, 'Only 5 points from your best!')
  assert.equal(describeRun(44, 50).nearMiss, null)
})

test('scores clamp to 0 through 100', () => {
  assert.equal(describeRun(140, 10).score, 100)
  assert.equal(describeRun(140, 10).isNewBest, true)
  assert.equal(describeRun(-4, null).score, 0)
  assert.equal(describeRun(10.4, null).score, 10)
})

test('combo points rise and then hold', () => {
  assert.equal(pointsForCombo(0), 8)
  assert.equal(pointsForCombo(1), 10)
  assert.equal(pointsForCombo(6), 20)
  assert.equal(pointsForCombo(9), 20)
})

test('play labels stay singular for one run', () => {
  assert.equal(playsLabel(1), '1 play')
  assert.equal(playsLabel(2), '2 plays')
})

test('a saved stat keeps an arcade id and a real play count', () => {
  assert.deepEqual(parseGameStat({ game_id: 'sum-sprint', best_score: 40, plays: 2 }), {
    gameId: 'sum-sprint',
    bestScore: 40,
    plays: 2,
  })
  assert.equal(parseGameStat({ game_id: 'other', best_score: 40, plays: 2 }), null)
  assert.equal(parseGameStat({ game_id: 'sum-sprint', best_score: 40, plays: 0 }), null)
})

test('a run payload has to match the score story', () => {
  const parsed = parseGameRun({
    gameId: 'word-trail',
    score: 47,
    previousBest: 50,
    best: 50,
    plays: 3,
    isNewBest: false,
  })
  assert.equal(parsed?.story.nearMiss, 'Only 3 points from your best!')
  assert.equal(parsed?.plays, 3)
  assert.equal(
    parseGameRun({
      gameId: 'word-trail',
      score: 47,
      previousBest: 50,
      best: 50,
      plays: 3,
      isNewBest: true,
    }),
    null,
  )
  assert.equal(
    parseGameRun({
      gameId: 'word-trail',
      score: 10,
      previousBest: null,
      best: 10,
      plays: 2,
      isNewBest: true,
    }),
    null,
  )
})
