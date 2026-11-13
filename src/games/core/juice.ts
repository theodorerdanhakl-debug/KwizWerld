import Phaser from 'phaser'
import { cssColorToHex } from './colors'

const DOT = 'burst-dot'

export function ensureBurstTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(DOT)) return
  const graphics = scene.make.graphics({ x: 0, y: 0 }, false)
  graphics.fillStyle(0xffffff, 1)
  graphics.fillCircle(6, 6, 6)
  graphics.generateTexture(DOT, 12, 12)
  graphics.destroy()
}

export function burst(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: string,
  combo: number,
  reduced: boolean,
): void {
  if (reduced || !scene.textures.exists(DOT)) return
  const emitter = scene.add.particles(x, y, DOT, {
    speed: { min: 50, max: 150 + Math.min(combo, 8) * 14 },
    lifespan: 280,
    scale: { start: 0.55, end: 0 },
    tint: cssColorToHex(color),
    emitting: false,
  })
  emitter.explode(8 + Math.min(combo, 8) * 2)
  window.setTimeout(() => {
    if (emitter.scene) emitter.destroy()
  }, 360)
}

export function floatText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  color: string,
  reduced: boolean,
  combo = 0,
): void {
  const size = 22 + Math.min(Math.max(combo, 0), 8) * 2
  const text = scene.add
    .text(x, y, label, {
      fontFamily: 'Fredoka, Trebuchet MS, sans-serif',
      fontSize: `${size}px`,
      color,
    })
    .setOrigin(0.5)
  if (reduced) {
    window.setTimeout(() => {
      if (text.scene) text.destroy()
    }, 520)
    return
  }
  scene.tweens.add({
    targets: text,
    y: y - 46,
    alpha: 0,
    duration: 420,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      if (text.scene) text.destroy()
    },
  })
}

export function squash(scene: Phaser.Scene, target: Phaser.GameObjects.Container, reduced: boolean): void {
  if (reduced) return
  scene.tweens.add({
    targets: target,
    scaleX: 1.14,
    scaleY: 0.86,
    duration: 70,
    yoyo: true,
    ease: 'Quad.easeOut',
  })
}

export function shake(scene: Phaser.Scene, combo: number, reduced: boolean, strong = false): void {
  if (reduced) return
  const intensity = Math.min(0.01, (strong ? 0.004 : 0.0018) + combo * 0.0007)
  const duration = Math.min(140, (strong ? 100 : 70) + combo * 6)
  scene.cameras.main.shake(duration, intensity)
}

export function hitStop(scene: Phaser.Scene, combo: number, reduced: boolean): void {
  if (reduced) return
  const token = scene.data.get('juice')
  scene.time.timeScale = 0.04
  const wait = Math.min(80, 40 + Math.max(combo, 0) * 5)
  window.setTimeout(() => {
    if (scene.data.get('juice') !== token) return
    if (!scene.scene.isActive()) return
    scene.time.timeScale = 1
  }, wait)
}

export function punchCamera(scene: Phaser.Scene, combo: number, reduced: boolean): void {
  const camera = scene.cameras.main
  if (reduced) {
    camera.setZoom(1)
    return
  }
  const zoom = Math.min(1.045, 1 + Math.max(combo, 1) * 0.006)
  camera.zoomTo(zoom, 90, 'Sine.easeOut', true, () => {
    if (!scene.scene.isActive()) return
    camera.zoomTo(1, 180, 'Sine.easeInOut', true)
  })
}
