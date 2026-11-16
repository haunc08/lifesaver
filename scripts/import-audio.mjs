// Converts the downloaded sound packs into the small MP3 files the game ships.
// The downloads themselves stay out of git; see docs/art-and-audio.md, section 3,
// for where each one comes from.
//
//   node scripts/import-audio.mjs <folder>
//
// <folder> must contain:
//   iface/Audio/*.ogg        Kenney "Interface Sounds", unzipped
//   jingles/OGG/jingles_*/   Kenney "Music Jingles", unzipped
//   music-town.ogg           "Cozy Puzzle Title" by MintoDog
//   music-level.ogg          "Forget Me Not" (looped) by Kistol
import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'src/assets/audio'

/** Game sound name -> file inside the downloads. Change a line here to swap a sound. */
const SFX = {
  tap: 'iface/Audio/click_001.ogg',
  clue: 'iface/Audio/pluck_002.ogg',
  right: 'iface/Audio/confirmation_001.ogg',
  wrong: 'iface/Audio/error_003.ogg',
  warn: 'iface/Audio/question_002.ogg',
  hit: 'iface/Audio/drop_002.ogg',
  tick: 'iface/Audio/tick_002.ogg',
  star: 'iface/Audio/confirmation_002.ogg',
  pass: 'jingles/OGG/jingles_PIZZA/jingles_PIZZA02.ogg',
  fail: 'jingles/OGG/jingles_PIZZA/jingles_PIZZA01.ogg',
}

const MUSIC = { town: 'music-town.ogg', level: 'music-level.ogg' }

/** Peak level every effect is brought to, so none is much louder than the rest. */
const SFX_PEAK_DB = -3
/** A soft start and end, because an MP3 cannot loop without a tiny gap. */
const MUSIC_FADE_IN_SEC = 0.4
const MUSIC_FADE_OUT_SEC = 1.5

const source = process.argv[2]
if (!source) {
  console.error('usage: node scripts/import-audio.mjs <folder with the downloads>')
  process.exit(1)
}

const ffmpeg = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'pipe' })

function measure(file) {
  // volumedetect reports on stderr, which execFileSync only returns on failure, so redirect it.
  const out = execFileSync(
    'sh',
    ['-c', 'ffmpeg -hide_banner -i "$1" -af volumedetect -f null - 2>&1', 'sh', file],
    { encoding: 'utf8' },
  )
  return Number(/max_volume: (-?[\d.]+) dB/.exec(out)?.[1] ?? 0)
}

function duration(file) {
  return Number(
    execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    ),
  )
}

mkdirSync(OUT, { recursive: true })

for (const [name, path] of Object.entries(SFX)) {
  const input = join(source, path)
  const gain = SFX_PEAK_DB - measure(input)
  const output = join(OUT, `sfx-${name}.mp3`)
  ffmpeg(['-i', input, '-af', `volume=${gain.toFixed(1)}dB`, '-ac', '1', '-ar', '44100', '-b:a', '96k', output])
  console.log(`${output}  ${statSync(output).size} bytes`)
}

for (const [name, path] of Object.entries(MUSIC)) {
  const input = join(source, path)
  const fadeOutAt = duration(input) - MUSIC_FADE_OUT_SEC
  const output = join(OUT, `music-${name}.mp3`)
  ffmpeg([
    '-i', input,
    '-af',
    `loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:d=${MUSIC_FADE_IN_SEC},afade=t=out:st=${fadeOutAt.toFixed(2)}:d=${MUSIC_FADE_OUT_SEC}`,
    '-ar', '44100', '-b:a', '96k', output,
  ])
  console.log(`${output}  ${statSync(output).size} bytes`)
}
