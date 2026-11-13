import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  equippedCosmetics,
  formatCountdown,
  nextReset,
  parseLeaderboard,
  showPinnedViewer,
} from './leaderboard.ts'

test('daily reset is the next UTC midnight', () => {
  assert.equal(nextReset('day', new Date('2026-11-13T23:30:00.000Z'))?.toISOString(), '2026-11-14T00:00:00.000Z')
  assert.equal(nextReset('day', new Date('2026-11-14T00:00:00.000Z'))?.toISOString(), '2026-11-15T00:00:00.000Z')
})

test('weekly reset uses Monday at UTC midnight', () => {
  assert.equal(nextReset('week', new Date('2026-11-13T18:00:00.000Z'))?.toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(nextReset('week', new Date('2026-11-15T23:00:00.000Z'))?.toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(nextReset('week', new Date('2026-11-16T00:00:00.000Z'))?.toISOString(), '2026-11-23T00:00:00.000Z')
  assert.equal(nextReset('week', new Date('2026-11-16T12:00:00.000Z'))?.toISOString(), '2026-11-23T00:00:00.000Z')
})

test('all-time has no reset', () => {
  assert.equal(nextReset('all', new Date('2026-11-13T00:00:00.000Z')), null)
})

test('countdown text stays short', () => {
  assert.equal(formatCountdown(2 * 86400000 + 3 * 3600000), '2d 3h')
  assert.equal(formatCountdown(86400000), '1d')
  assert.equal(formatCountdown(3600000 + 5 * 60000), '1h 5m')
  assert.equal(formatCountdown(3600000), '1h')
  assert.equal(formatCountdown(90000), '1:30')
  assert.equal(formatCountdown(0), '0:00')
  assert.equal(formatCountdown(-10), '0:00')
})

test('cosmetic ids are kept and colors are not', () => {
  assert.deepEqual(
    equippedCosmetics({
      avatar: 'star-cap',
      decoration: 'ring',
      nameColor: '#ff00aa',
      nameFont: 'Rounded',
      nameplate: 'oak',
      badges: ['reader', 'nope!', 4],
      inventory: ['secret'],
    }),
    {
      avatar: 'star-cap',
      decoration: 'ring',
      nameColor: null,
      nameFont: null,
      nameplate: 'oak',
      badges: ['reader'],
    },
  )
})

test('a viewer outside the top 100 is pinned, and a listed viewer is not', () => {
  const entries = [{ userId: 'ada' }, { userId: 'miles' }]
  assert.equal(showPinnedViewer(entries, { userId: 'noor' }), true)
  assert.equal(showPinnedViewer(entries, { userId: 'ada' }), false)
  assert.equal(showPinnedViewer(entries, null), false)
})

test('the board parser keeps a hundred rows and the viewer', () => {
  const entries = Array.from({ length: 101 }, (_, index) => ({
    rank: index + 1,
    userId: `user-${index}`,
    username: `User${index}`,
    exp: 1000 - index,
    cosmetics: {},
  }))
  const board = parseLeaderboard(
    {
      board: 'day',
      resetsAt: '2026-11-14T00:00:00.000Z',
      entries,
      viewer: { rank: 140, userId: 'viewer', username: 'Ada', exp: 12, cosmetics: { avatar: 'star-cap' }, pinned: true },
    },
    'day',
  )
  assert.equal(board?.entries.length, 100)
  assert.equal(board?.entries[0]?.username, 'User0')
  assert.equal(board?.viewer?.rank, 140)
  assert.equal(board?.viewer?.pinned, true)
  assert.equal(board?.viewer?.cosmetics.avatar, 'star-cap')
  assert.equal(board?.resetsAt, '2026-11-14T00:00:00.000Z')
})

test('a viewer already listed is not marked pinned', () => {
  const board = parseLeaderboard(
    {
      board: 'all',
      resetsAt: 'ignored',
      entries: [{ rank: 1, userId: 'ada', username: 'Ada', exp: 40, cosmetics: {} }],
      viewer: { rank: 1, userId: 'ada', username: 'Ada', exp: 40, cosmetics: {}, pinned: true },
    },
    'all',
  )
  assert.equal(board?.resetsAt, null)
  assert.equal(board?.viewer?.pinned, false)
  assert.equal(showPinnedViewer(board?.entries ?? [], board?.viewer ?? null), false)
})

test('a daily board without a reset time is rejected', () => {
  assert.equal(
    parseLeaderboard({ board: 'day', entries: [], viewer: null }, 'day'),
    null,
  )
})
