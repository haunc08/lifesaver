import type { AreaId } from '@/game/types'
import { useSave } from '@/state/save'

/**
 * Sound effects and background sound. Files live in src/assets/audio as
 * `sfx-<name>.mp3`, `music-<name>.mp3` and `ambience-<area or level id>.mp3`; a
 * name with no file is silently skipped, so the game runs the same with or
 * without audio files. Nothing plays before the player's first tap, which phone
 * browsers require.
 *
 * One background sound plays at a time: the town tune in the menus, and inside
 * a level the sound of its place. That is the level's own recording if it has
 * one (the school library, the football pitch), otherwise its area's.
 */

export type SfxName =
  'tap' | 'clue' | 'right' | 'wrong' | 'warn' | 'hit' | 'tick' | 'star' | 'pass' | 'fail'

export type MusicName = 'town'

/** What plays in the background: a music track, or the sound of the place a level is set in. */
export type Background =
  { kind: 'music'; name: MusicName } | { kind: 'ambience'; area: AreaId; levelId?: string }

const FILES = import.meta.glob<string>('../assets/audio/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})

function url(kind: 'sfx' | 'music' | 'ambience', name: string): string | undefined {
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
/** Recordings of places are quieter than music to begin with, so they are turned up more. */
const AMBIENCE_VOLUME = 0.5
/** Extra time the music stays lowered after a jingle, so the two do not collide. */
const FADE_MS = 400

let context: AudioContext | null = null
const buffers = new Map<SfxName, AudioBuffer>()
let musicElement: HTMLAudioElement | null = null
let wanted: Background | null = null
/** Name of the file now loaded, e.g. "town" or "ambience-park". */
let playing: string | null = null
let volume = MUSIC_VOLUME
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

/** The file for what is wanted; null when there is none, and then nothing plays. */
function resolve(background: Background | null) {
  if (!background) return null
  if (background.kind === 'ambience') {
    // A level set somewhere unlike the rest of its area has its own recording.
    const { area, levelId } = background
    const place = levelId && url('ambience', levelId) ? levelId : area
    const src = url('ambience', place)
    return src ? { name: `ambience-${place}`, src, volume: AMBIENCE_VOLUME } : null
  }
  const src = url('music', background.name)
  return src ? { name: background.name, src, volume: MUSIC_VOLUME } : null
}

function syncMusic() {
  if (!unlocked || !musicElement) return
  const on = useSave.getState().settings.music && !document.hidden
  const track = resolve(wanted)
  if (!on || !track) {
    musicElement.pause()
    return
  }
  if (playing !== track.name) {
    playing = track.name
    volume = track.volume
    musicElement.src = track.src
    musicElement.volume = volume
  }
  void musicElement.play().catch(() => undefined)
}

/** Choose what plays in the background; null stops it. */
export function setBackground(background: Background | null) {
  wanted = background
  syncMusic()
}

/** Lower the music briefly, for example under a result jingle. */
export function duckMusic(ms: number) {
  if (!musicElement) return
  const element = musicElement
  element.volume = volume * 0.25
  setTimeout(() => (element.volume = volume), ms + FADE_MS)
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
  musicElement.volume = volume
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
