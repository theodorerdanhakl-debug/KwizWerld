import { useLayoutEffect, useRef } from 'react'
import Phaser from 'phaser'
import type { ArcadeSpec } from '../../data/arcade'
import type { GameBridge } from './bridge'
import { ChallengeScene, STAGE_HEIGHT, STAGE_WIDTH } from './ChallengeScene'
import { readGameColors } from './colors'

export function PhaserMount({ spec, bridge }: { spec: ArcadeSpec; bridge: GameBridge }) {
  const host = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const parent = host.current
    if (!parent) return
    const root = parent.closest('[data-subject]')
    bridge.setColors(readGameColors(root instanceof HTMLElement ? root : parent))
    const scene = new ChallengeScene(spec, bridge)
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      backgroundColor: bridge.read().colors.background,
      banner: false,
      transparent: true,
      autoFocus: false,
      disableContextMenu: true,
      audio: { noAudio: true },
      input: {
        keyboard: true,
        mouse: true,
        touch: true,
        activePointers: 3,
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene,
    })
    bridge.attach(scene)
    return () => {
      bridge.attach(null)
      game.destroy(true)
    }
  }, [bridge, spec])

  return <div ref={host} className="game-host" />
}
