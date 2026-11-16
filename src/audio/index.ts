import { useSave } from '@/state/save'

/**
 * Sound effects and music. Files live in src/assets/audio as `sfx-<name>.mp3`
 * and `music-<name>.mp3`; a name with no file is silently skipped, so the game
 * runs the same with or without audio files. Nothing plays before the player's
 * first tap, which phone browsers require.
 */

export type SfxName =
  'tap' | 'clue' | 'right' | 'wrong' | 'warn' | 'hit' | 'tick' | 'star' | 'pass' | 'fail'

export type MusicName = 'town' | 'level'

const FILES = import.meta.glob<string>('../assets/audio/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})

function url(kind: 'sfx' | 'music', name: string): string | undefined {
  return FILES[`../assets/audio/${kind}-${name}.mp3`]
}

/** Loudness of each effect, so quiet interface sounds sit under the feedback sounds. */
const SFX_GAIN: Record<SfxName, number> = {
  tap: 0.35,
  clue: 0.6,
  right: 0.7,
  wrong: 0.6,
  warn: 0.7,
  hit: 0.6,
  tick: 0.4,
  star: 0.7,
  pass: 0.8,
  fail: 0.7,
}
const MUSIC_VOLUME = 0.28
/** Extra time the music stays lowered after a jingle, so the two do not collide. */
const FADE_MS = 400

let context: AudioContext | null = null
const buffers = new Map<SfxName, AudioBuffer>()
let musicElement: HTMLAudioElement | null = null
let wanted: MusicName | null = null
let playing: MusicName | null = null
let unlocked = false

async function load(name: SfxName) {
  const src = url('sfx', name)
  if (!src || !context) return
  try {
    const data = await (await fetch(src)).arrayBuffer()
    buffers.set(name, await context.decodeAudioData(data))
  } catch {
    // A sound that fails to load is skipped; the game never depends on audio.
  }
}

/** Play a sound effect, if effects are switched on and the file exists. */
export function sfx(name: SfxName) {
  const buffer = buffers.get(name)
  if (!context || !buffer || !useSave.getState().settings.sfx) return
  const source = context.createBufferSource()
  const gain = context.createGain()
  gain.gain.value = SFX_GAIN[name]
  source.buffer = buffer
  source.connect(gain).connect(context.destination)
  source.start()
}

function syncMusic() {
  if (!unlocked || !musicElement) return
  const on = useSave.getState().settings.music && !document.hidden
  const src = wanted ? url('music', wanted) : undefined
  if (!on || !src) {
    musicElement.pause()
    return
  }
  if (playing !== wanted) {
    playing = wanted
    musicElement.src = src
  }
  void musicElement.play().catch(() => undefined)
}

/** Choose the background track; null stops the music. */
export function setMusic(track: MusicName | null) {
  wanted = track
  syncMusic()
}

/** Lower the music briefly, for example under a result jingle. */
export function duckMusic(ms: number) {
  if (!musicElement) return
  const element = musicElement
  element.volume = MUSIC_VOLUME * 0.25
  setTimeout(() => (element.volume = MUSIC_VOLUME), ms + FADE_MS)
}

function unlock() {
  if (unlocked) return
  unlocked = true
  const Context = window.AudioContext
  if (Context) {
    context = new Context()
    void context.resume()
    for (const name of Object.keys(SFX_GAIN) as SfxName[]) void load(name)
  }
  musicElement = new Audio()
  musicElement.loop = true
  musicElement.volume = MUSIC_VOLUME
  syncMusic()
}

/** What the sound engine is doing right now; used by the end-to-end test and for troubleshooting. */
export function audioStatus() {
  return {
    unlocked,
    effectsLoaded: [...buffers.keys()].sort(),
    track: playing,
    musicPlaying: Boolean(musicElement && !musicElement.paused),
  }
}

/** Call once at start-up: wires the first tap, the settings switches and button taps. */
export function initAudio() {
  window.addEventListener('pointerdown', unlock, { once: true, capture: true })
  window.addEventListener('keydown', unlock, { once: true, capture: true })
  document.addEventListener('visibilitychange', syncMusic)
  useSave.subscribe(syncMusic)
  // Every button gets the soft tap, unless it sits inside an element marked
  // data-sfx="none" because its own action makes a sound.
  document.addEventListener(
    'click',
    (event) => {
      const button = (event.target as Element | null)?.closest?.('button')
      if (button && !button.disabled && !button.closest('[data-sfx="none"]')) sfx('tap')
    },
    { capture: true },
  )
}
