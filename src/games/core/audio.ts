// Short layered tones. Pitch steps up with the combo. Music is a very quiet bed.

const HIT_GAIN = 0.07
const LAYER_GAIN = 0.035
const SPARK_GAIN = 0.02

export class GameAudio {
  private context: AudioContext | null = null
  private effectsOn = true
  private musicOn = true
  private bedGain: GainNode | null = null
  private bedNodes: OscillatorNode[] = []

  setEnabled(effects: boolean, music: boolean): void {
    this.effectsOn = effects
    this.musicOn = music
    if (music) this.startBed()
    else this.stopBed()
  }

  unlock(): void {
    const Context = window.AudioContext
    if (!Context) return
    if (!this.context) this.context = new Context()
    void this.context.resume()
    if (this.musicOn) this.startBed()
  }

  playHit(combo: number): void {
    const step = Math.min(Math.max(combo, 1), 12)
    const pitch = Math.min(880, 320 * 1.06 ** (step - 1))
    this.tone(pitch, HIT_GAIN, 'sine', 0.12)
    this.tone(pitch * 1.5, LAYER_GAIN, 'triangle', 0.1)
    if (step >= 4) this.tone(Math.min(990, pitch * 2), SPARK_GAIN, 'sine', 0.14)
  }

  playMiss(): void {
    this.tone(140, 0.05, 'sine', 0.16)
  }

  playBest(): void {
    this.tone(523, 0.06, 'triangle', 0.12)
    window.setTimeout(() => this.tone(659, 0.06, 'triangle', 0.12), 90)
    window.setTimeout(() => this.tone(784, 0.07, 'triangle', 0.18), 180)
  }

  dispose(): void {
    this.stopBed()
    const context = this.context
    this.context = null
    if (context) void context.close()
  }

  private tone(freq: number, gain: number, type: OscillatorType, duration: number): void {
    if (!this.context || !this.effectsOn) return
    const context = this.context
    const osc = context.createOscillator()
    const amp = context.createGain()
    osc.type = type
    osc.frequency.value = freq
    amp.gain.setValueAtTime(gain, context.currentTime)
    amp.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
    osc.connect(amp)
    amp.connect(context.destination)
    osc.start()
    osc.stop(context.currentTime + duration + 0.02)
  }

  private startBed(): void {
    if (!this.context || this.bedGain || !this.musicOn) return
    const context = this.context
    const gain = context.createGain()
    gain.gain.value = 0.012
    gain.connect(context.destination)
    for (const freq of [196, 246.94]) {
      const osc = context.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      osc.start()
      this.bedNodes.push(osc)
    }
    this.bedGain = gain
  }

  private stopBed(): void {
    for (const osc of this.bedNodes) {
      try {
        osc.stop()
      } catch {
        // The oscillator may already be stopped.
      }
    }
    this.bedNodes = []
    this.bedGain?.disconnect()
    this.bedGain = null
  }
}
