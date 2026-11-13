import Phaser from 'phaser'
import type { ArcadeRound, ArcadeSpec, ChoiceRound, OrderRound } from '../../data/arcade'
import type { GameBridge } from './bridge'
import { cssColorToHex } from './colors'
import { burst, ensureBurstTexture, floatText, hitStop, punchCamera, shake, squash } from './juice'
import { MISS_LIMIT, RUN_MS, pointsForCombo } from './result'

export const STAGE_WIDTH = 800
export const STAGE_HEIGHT = 500

const CAPTURE = [32, 37, 38, 39, 40, 49, 50, 51, 52, 97, 98, 99, 100]

type PlayCard = {
  value: string
  used: boolean
  hot: boolean
  container: Phaser.GameObjects.Container
  graphics: Phaser.GameObjects.Graphics
  text: Phaser.GameObjects.Text
  zone: Phaser.GameObjects.Zone
  width: number
  height: number
  round: boolean
}

export class ChallengeScene extends Phaser.Scene {
  private readonly spec: ArcadeSpec
  private readonly bridge: GameBridge
  private field!: Phaser.GameObjects.Graphics
  private cards: PlayCard[] = []
  private current: ArcadeRound | null = null
  private score = 0
  private combo = 0
  private misses = 0
  private roundIndex = 0
  private spelled = 0
  private selected = 0
  private done = false
  private locked = false
  private keyUsed = false
  private endsAt = 0
  private timer: number | null = null
  private timeouts = new Set<number>()
  private juiceToken = 0

  constructor(spec: ArcadeSpec, bridge: GameBridge) {
    super({ key: 'play' })
    this.spec = spec
    this.bridge = bridge
  }

  create(): void {
    this.score = 0
    this.combo = 0
    this.misses = 0
    this.roundIndex = 0
    this.spelled = 0
    this.selected = 0
    this.done = false
    this.locked = false
    this.keyUsed = false
    this.cards = []
    this.current = null
    this.endsAt = performance.now() + RUN_MS
    this.cameras.main.setZoom(1)
    this.time.timeScale = 1
    this.input.enabled = true
    this.field = this.add.graphics()
    this.drawField()
    ensureBurstTexture(this)
    this.bindKeys()
    this.events.once('shutdown', this.handleShutdown, this)
    this.armClock()
    this.showRound()
    this.game.canvas.setAttribute('aria-hidden', 'true')
    this.game.canvas.tabIndex = -1
  }

  restartRun(): void {
    this.scene.restart()
  }

  applyColors(): void {
    if (!this.field) return
    this.drawField()
    this.paintCards()
  }

  celebrate(exp: number, diamonds: number): void {
    if (!this.scene.isActive() || (exp <= 0 && diamonds <= 0)) return
    const reduced = this.bridge.read().reducedMotion
    const colors = this.bridge.read().colors
    if (exp > 0) floatText(this, STAGE_WIDTH / 2, 150, `+${exp} EXP`, colors.exp, reduced)
    if (diamonds > 0) {
      const label = `+${diamonds} ${diamonds === 1 ? 'diamond' : 'diamonds'}`
      floatText(this, STAGE_WIDTH / 2, 214, label, colors.diamond, reduced)
    }
    burst(this, STAGE_WIDTH / 2, 180, exp > 0 ? colors.exp : colors.diamond, 3, reduced)
  }

  private drawField(): void {
    const colors = this.bridge.read().colors
    this.cameras.main.setBackgroundColor(colors.background)
    this.field.clear()
    this.field.fillStyle(cssColorToHex(colors.border), 0.7)
    this.field.fillCircle(84, 64, 26)
    this.field.fillCircle(STAGE_WIDTH - 70, STAGE_HEIGHT - 58, 36)
    this.field.fillStyle(cssColorToHex(colors.accent), 0.16)
    this.field.fillCircle(STAGE_WIDTH - 96, 72, 20)
  }

  private showRound(): void {
    if (this.done) return
    this.clearCards()
    const round = this.spec.rounds[this.roundIndex % this.spec.rounds.length]
    if (!round) {
      this.finishRun()
      return
    }
    this.current = round
    this.locked = false
    this.selected = 0
    this.bridge.prompt(round.prompt)
    if (round.kind === 'choice') this.layoutChoice(round)
    else this.layoutOrder(round)
    this.bridge.options(this.cards.map((card) => (round.kind === 'order' ? card.value.toUpperCase() : card.value)))
  }

  private layoutChoice(round: ChoiceRound): void {
    const count = round.choices.length
    const columns = count === 3 ? 3 : 2
    const width = count === 2 ? 330 : count === 3 ? 210 : 300
    const height = count === 4 ? 156 : count === 3 ? 176 : 196
    const spots = centers(count, width, height, 24, 22, columns)
    shuffled(round.choices).forEach((choice, index) => {
      const spot = spots[index]
      if (!spot) return
      this.addCard(spot.x, spot.y, width, height, choice, choice, false)
    })
  }

  private layoutOrder(round: OrderRound): void {
    const letters = shuffled(round.word.split(''))
    const size = 112
    const spots = centers(letters.length, size, size, 18, 18, letters.length)
    letters.forEach((letter, index) => {
      const spot = spots[index]
      if (!spot) return
      this.addCard(spot.x, spot.y, size, size, letter.toUpperCase(), letter, true)
    })
  }

  private addCard(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    value: string,
    round: boolean,
  ): void {
    const index = this.cards.length
    const container = this.add.container(x, y)
    const graphics = this.add.graphics()
    const fontSize = round ? 36 : label.length > 12 ? 22 : 30
    const text = this.add
      .text(0, 0, label, {
        fontFamily: 'Inter, sans-serif',
        fontSize: `${fontSize}px`,
        color: this.bridge.read().colors.text,
        align: 'center',
        wordWrap: { width: width - 32 },
      })
      .setOrigin(0.5)
    container.add([graphics, text])
    container.setDepth(1)
    const zone = this.add.zone(x, y, width, height).setInteractive({ useHandCursor: true })
    zone.setDepth(2)
    const card: PlayCard = {
      value,
      used: false,
      hot: false,
      container,
      graphics,
      text,
      zone,
      width,
      height,
      round,
    }
    zone.on('pointerdown', () => this.choose(index))
    zone.on('pointerover', () => {
      card.hot = true
      this.paintCard(card, index)
    })
    zone.on('pointerout', () => {
      card.hot = false
      this.paintCard(card, index)
    })
    this.cards.push(card)
    this.paintCard(card, index)
  }

  private paintCards(): void {
    this.cards.forEach((card, index) => this.paintCard(card, index))
  }

  private paintCard(card: PlayCard, index: number): void {
    const colors = this.bridge.read().colors
    const focused = this.keyUsed && index === this.selected && !card.used
    const fill = card.used ? colors.accent : colors.surface
    const ink = card.used ? colors.onAccent : colors.text
    const radius = card.round ? card.width / 2 : 18
    const left = -card.width / 2
    const top = -card.height / 2
    const mark = focused || (card.hot && !card.used)
    card.graphics.clear()
    card.graphics.fillStyle(cssColorToHex(fill), 1)
    card.graphics.fillRoundedRect(left, top, card.width, card.height, radius)
    card.graphics.lineStyle(mark ? 5 : 3, cssColorToHex(mark ? colors.accent : colors.border), 1)
    card.graphics.strokeRoundedRect(left, top, card.width, card.height, radius)
    card.text.setColor(ink)
  }

  private choose(index: number): void {
    if (this.locked || this.done) return
    const card = this.cards[index]
    const round = this.current
    if (!card || card.used || !round) return
    if (round.kind === 'choice') {
      this.locked = true
      if (card.value === round.answer) this.succeed(card)
      else this.fail(card)
      return
    }
    if (card.value !== round.word[this.spelled]) {
      this.fail(card)
      return
    }
    card.used = true
    card.zone.disableInteractive()
    this.spelled += 1
    this.paintCard(card, index)
    squash(this, card.container, this.bridge.read().reducedMotion)
    if (this.spelled >= round.word.length) this.succeed(card)
  }

  private succeed(card: PlayCard): void {
    const gain = pointsForCombo(this.combo)
    this.combo += 1
    this.score = Math.min(100, this.score + gain)
    this.locked = true
    card.used = true
    this.paintCard(card, this.cards.indexOf(card))
    this.publish()
    const reduced = this.bridge.read().reducedMotion
    const colors = this.bridge.read().colors
    this.bridge.audio.playHit(this.combo)
    floatText(this, card.container.x, card.container.y - 64, `+${gain}`, colors.text, reduced, this.combo)
    burst(this, card.container.x, card.container.y, colors.accent, this.combo, reduced)
    squash(this, card.container, reduced)
    shake(this, this.combo, reduced)
    hitStop(this, this.combo, reduced)
    punchCamera(this, this.combo, reduced)
    this.later(150, () => this.advance())
  }

  private fail(card: PlayCard): void {
    this.combo = 0
    this.misses += 1
    this.publish()
    const reduced = this.bridge.read().reducedMotion
    this.bridge.audio.playMiss()
    squash(this, card.container, reduced)
    shake(this, 2, reduced, true)
    if (this.misses >= MISS_LIMIT) {
      this.locked = true
      this.later(180, () => this.finishRun())
      return
    }
    if (this.current?.kind === 'choice') {
      this.locked = true
      this.later(160, () => this.advance())
      return
    }
    this.locked = true
    this.later(70, () => {
      this.locked = false
    })
  }

  private advance(): void {
    if (this.done) return
    this.roundIndex += 1
    this.spelled = 0
    this.showRound()
  }

  private finishRun(): void {
    if (this.done) return
    this.done = true
    this.clearTimers()
    const camera = this.cameras?.main
    if (!camera || !this.sys?.isActive()) return
    this.clearCards()
    camera.setZoom(1)
    this.input.enabled = false
    this.unbindKeys()
    this.publish()
    this.bridge.finish(this.score)
  }

  private publish(): void {
    this.bridge.progress(this.score, this.combo, this.remaining())
  }

  private remaining(): number {
    return Math.max(0, this.endsAt - performance.now())
  }

  private armClock(): void {
    this.publish()
    this.timer = window.setInterval(() => {
      if (this.done) return
      const left = this.remaining()
      this.publish()
      if (left <= 0) this.finishRun()
    }, 100)
  }

  private later(ms: number, fn: () => void): void {
    const token = this.juiceToken
    const id = window.setTimeout(() => {
      this.timeouts.delete(id)
      if (token !== this.juiceToken || this.done) return
      fn()
    }, ms)
    this.timeouts.add(id)
  }

  private clearTimers(): void {
    this.juiceToken += 1
    this.data.set('juice', this.juiceToken)
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    for (const id of this.timeouts) window.clearTimeout(id)
    this.timeouts.clear()
    this.time.timeScale = 1
  }

  private clearCards(): void {
    for (const card of this.cards) {
      card.zone.destroy()
      card.container.destroy()
    }
    this.cards = []
  }

  private bindKeys(): void {
    const keyboard = this.input.keyboard
    if (!keyboard) return
    keyboard.enabled = true
    keyboard.on('keydown', this.onKeyDown)
    keyboard.addCapture(CAPTURE)
  }

  private unbindKeys(): void {
    const keyboard = this.input.keyboard
    if (!keyboard) return
    keyboard.off('keydown', this.onKeyDown)
    keyboard.removeCapture(CAPTURE)
    keyboard.enabled = false
  }

  private handleShutdown = (): void => {
    this.clearTimers()
    this.unbindKeys()
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.done || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    const round = this.current
    if (!round) return
    const key = physicalKey(event)
    if ((key === 'Enter' || key === ' ') && controlTarget(event)) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || key === 'ArrowRight' || key === 'ArrowDown') {
      event.preventDefault()
      this.move(1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowUp') {
      event.preventDefault()
      this.move(-1)
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      this.keyUsed = true
      this.choose(this.selected)
      return
    }
    if (round.kind === 'choice') {
      const digit = choiceDigit(key, event)
      if (digit) {
        event.preventDefault()
        this.keyUsed = true
        const index = digit - 1
        if (index < this.cards.length) this.choose(index)
      }
      return
    }
    const letter = key.toLowerCase()
    if (!/^[a-z]$/.test(letter)) return
    this.keyUsed = true
    const index = this.cards.findIndex((card) => !card.used && card.value === letter)
    if (index < 0) {
      const fallback = this.cards[this.selected]
      if (fallback) this.fail(fallback)
      return
    }
    this.choose(index)
  }

  private move(delta: number): void {
    if (this.locked || this.cards.length === 0) return
    this.keyUsed = true
    let next = this.selected
    for (let guard = 0; guard < this.cards.length; guard += 1) {
      next = (next + delta + this.cards.length) % this.cards.length
      if (!this.cards[next]?.used) break
    }
    this.selected = next
    this.paintCards()
  }
}

function physicalKey(event: KeyboardEvent): string {
  if (event.key && event.key !== 'Unidentified') return event.key
  if (event.code === 'Space') return ' '
  if (event.code === 'Enter' || event.code === 'NumpadEnter') return 'Enter'
  if (event.code?.startsWith('Arrow')) return event.code
  if (event.code?.startsWith('Digit')) return event.code.slice(5)
  if (event.code?.startsWith('Numpad') && event.code.length === 7) return event.code.slice(6)
  if (event.code?.startsWith('Key') && event.code.length === 4) return event.code.slice(3).toLowerCase()
  const code = event.keyCode
  if (code >= 49 && code <= 52) return String(code - 48)
  if (code >= 97 && code <= 100) return String(code - 96)
  if (code >= 65 && code <= 90) return String.fromCharCode(code).toLowerCase()
  return ''
}

function choiceDigit(key: string, event: KeyboardEvent): number | null {
  if (/^[1-4]$/.test(key)) return Number(key)
  const code = event.keyCode
  if (code >= 49 && code <= 52) return code - 48
  if (code >= 97 && code <= 100) return code - 96
  return null
}

function controlTarget(event: KeyboardEvent): boolean {
  const target = event.target
  return target instanceof Element && target.closest('a, button, input, textarea, select') !== null
}

function centers(
  count: number,
  width: number,
  height: number,
  gapX: number,
  gapY: number,
  columns: number,
): { x: number; y: number }[] {
  const rows = Math.ceil(count / columns)
  const gridW = columns * width + (columns - 1) * gapX
  const gridH = rows * height + (rows - 1) * gapY
  const originX = (STAGE_WIDTH - gridW) / 2
  const originY = (STAGE_HEIGHT - gridH) / 2 + 8
  const spots: { x: number; y: number }[] = []
  for (let index = 0; index < count; index += 1) {
    const column = index % columns
    const row = Math.floor(index / columns)
    spots.push({
      x: originX + column * (width + gapX) + width / 2,
      y: originY + row * (height + gapY) + height / 2,
    })
  }
  return spots
}

function shuffled<T>(items: readonly T[]): T[] {
  const next = items.slice()
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = next[index]
    next[index] = next[swap]
    next[swap] = current
  }
  return next
}
