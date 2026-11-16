// Converts the downloaded sound packs into the small MP3 files the game ships.
// The downloads themselves stay out of git; see docs/art-and-audio.md, section 3,
// for where each one comes from.
//
//   node scripts/import-audio.mjs <folder> [sfx] [music] [ambience]
//
// With no group named, all three are converted. <folder> must contain, for the
// groups asked for:
//   iface/Audio/*.ogg        Kenney "Interface Sounds", unzipped              (sfx)
//   jingles/OGG/jingles_*/   Kenney "Music Jingles", unzipped                 (sfx)
//   music-town.ogg           "Cozy Puzzle Title" by MintoDog                  (music)
//   ambience/<area>.ogg      one recording per area, named by area id         (ambience)
//                            (sources in docs/credits.md)
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

const MUSIC = { town: 'music-town.ogg' }

/** Area id -> recording of that kind of place. Change a line here to swap one. */
const AMBIENCE = {
  school: 'ambience/school.ogg',
  dormitory: 'ambience/dormitory.ogg',
  streets: 'ambience/streets.ogg',
  'food-district': 'ambience/food-district.ogg',
  park: 'ambience/park.ogg',
}

/** Peak level every effect is brought to, so none is much louder than the rest. */
const SFX_PEAK_DB = -3
/** A soft start and end, because an MP3 cannot loop without a tiny gap. */
const MUSIC_FADE_IN_SEC = 0.4
const MUSIC_FADE_OUT_SEC = 1.5
/** A recording of a place is cut to this length, skipping its first seconds. */
const AMBIENCE_SKIP_SEC = 3
const AMBIENCE_LENGTH_SEC = 60
const AMBIENCE_FADE_SEC = 2
/** All places are brought to the same loudness, well under the effects. */
const AMBIENCE_LUFS = -24

const [source, ...groups] = process.argv.slice(2)
if (!source) {
  console.error('usage: node scripts/import-audio.mjs <folder with the downloads> [sfx] [music] [ambience]')
  process.exit(1)
}
const wanted = (group) => groups.length === 0 || groups.includes(group)

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

for (const [name, path] of wanted('sfx') ? Object.entries(SFX) : []) {
  const input = join(source, path)
  const gain = SFX_PEAK_DB - measure(input)
  const output = join(OUT, `sfx-${name}.mp3`)
  ffmpeg(['-i', input, '-af', `volume=${gain.toFixed(1)}dB`, '-ac', '1', '-ar', '44100', '-b:a', '96k', output])
  console.log(`${output}  ${statSync(output).size} bytes`)
}

for (const [name, path] of wanted('music') ? Object.entries(MUSIC) : []) {
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

for (const [area, path] of wanted('ambience') ? Object.entries(AMBIENCE) : []) {
  const input = join(source, path)
  const length = Math.min(AMBIENCE_LENGTH_SEC, duration(input) - AMBIENCE_SKIP_SEC)
  const output = join(OUT, `ambience-${area}.mp3`)
  ffmpeg([
    '-ss', String(AMBIENCE_SKIP_SEC), '-t', length.toFixed(2), '-i', input,
    '-af',
    `loudnorm=I=${AMBIENCE_LUFS}:TP=-3:LRA=11,afade=t=in:d=${AMBIENCE_FADE_SEC},afade=t=out:st=${(length - AMBIENCE_FADE_SEC).toFixed(2)}:d=${AMBIENCE_FADE_SEC}`,
    '-ac', '1', '-ar', '44100', '-b:a', '64k', output,
  ])
  console.log(`${output}  ${statSync(output).size} bytes`)
}
