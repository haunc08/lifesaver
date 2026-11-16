// Generates game art through the Kie API (Seedream 5.5 text-to-image) from art/manifest.json.
//
//   node --env-file=.env scripts/gen-art.mjs <id> [<id>…]   generate these images
//   node --env-file=.env scripts/gen-art.mjs --missing      generate every image with no output yet
//   node scripts/gen-art.mjs --process <id>…                 re-run only the local resize/slice step
//
// Each run costs credits (see art/spend.json). Raw PNGs land in art/raw (not in git);
// compressed WebP copies land in src/assets/art and are what the game loads.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const RAW = join(ROOT, 'art/raw')
const OUT = join(ROOT, 'src/assets/art')
const SPEND = join(ROOT, 'art/spend.json')
const API = 'https://api.kie.ai/api/v1'
const MODEL = 'seedream/5-5-text-to-image'

const manifest = JSON.parse(readFileSync(join(ROOT, 'art/manifest.json'), 'utf8'))
const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const ids = args.filter((a) => !a.startsWith('--'))

const outputsOf = (image) =>
  image.slice ? image.slice.names.map((n) => `${image.out ?? image.id}-${n}`) : [image.id]
const isDone = (image) => outputsOf(image).every((n) => existsSync(join(OUT, `${n}.webp`)))

const wanted = flags.has('--missing')
  ? manifest.images.filter((i) => !isDone(i))
  : ids.map((id) => {
      const image = manifest.images.find((i) => i.id === id)
      if (!image) throw new Error(`No image "${id}" in art/manifest.json`)
      return image
    })

async function call(path, init) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await res.json()
  if (body.code !== 200) throw new Error(`${path}: ${body.code} ${body.msg}`)
  return body.data
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function generate(image) {
  const prompt = `${image.prompt.trim()} ${manifest.styles[image.style].trim()}`
  const { taskId } = await call('/jobs/createTask', {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      input: {
        prompt,
        aspect_ratio: image.aspect,
        size: '1.5K',
        output_format: 'png',
        background: image.transparent ? 'transparent' : 'opaque',
      },
    }),
  })
  const deadline = Date.now() + 5 * 60_000
  for (;;) {
    await sleep(3000)
    const info = await call(`/jobs/recordInfo?taskId=${taskId}`)
    if (info.state === 'fail') throw new Error(`${image.id}: ${info.failCode} ${info.failMsg}`)
    if (info.state === 'success') {
      const url = info.response?.resultUrls?.[0]
      if (!url) throw new Error(`${image.id}: no result url`)
      const file = await fetch(url)
      writeFileSync(join(RAW, `${image.id}.png`), Buffer.from(await file.arrayBuffer()))
      return info.creditsConsumed ?? null
    }
    if (Date.now() > deadline) throw new Error(`${image.id}: gave up waiting for ${taskId}`)
  }
}

/** Resize, slice sheets into cells, trim transparent edges and write WebP. */
async function process_(image) {
  const raw = join(RAW, `${image.id}.png`)
  const write = async (pipeline, name) => {
    let p = pipeline
    if (image.transparent) p = sharp(await p.png().toBuffer()).trim({ threshold: 8 })
    const maxWidth = image.width ?? 960
    await sharp(await p.png().toBuffer())
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 90 })
      .toFile(join(OUT, `${name}.webp`))
  }
  if (!image.slice) return write(sharp(raw), image.id)
  const { width, height } = await sharp(raw).metadata()
  const [cols, rows] = image.slice.grid
  const w = Math.floor(width / cols)
  const h = Math.floor(height / rows)
  for (const [i, name] of image.slice.names.entries()) {
    const region = { left: (i % cols) * w, top: Math.floor(i / cols) * h, width: w, height: h }
    // `out` lets several sheets write into one family of names, e.g. item-<name>.
    await write(sharp(raw).extract(region), `${image.out ?? image.id}-${name}`)
  }
}

mkdirSync(RAW, { recursive: true })
mkdirSync(OUT, { recursive: true })
const spend = existsSync(SPEND) ? JSON.parse(readFileSync(SPEND, 'utf8')) : []

const results = await Promise.allSettled(
  wanted.map(async (image) => {
    if (!flags.has('--process')) {
      const credits = await generate(image)
      spend.push({ id: image.id, credits, at: new Date().toISOString() })
    }
    await process_(image)
    return image.id
  }),
)
writeFileSync(SPEND, `${JSON.stringify(spend, null, 2)}\n`)
for (const [i, r] of results.entries()) {
  console.log(
    r.status === 'fulfilled' ? `ok    ${r.value}` : `FAIL  ${wanted[i].id}: ${r.reason.message}`,
  )
}
const total = spend.reduce((sum, s) => sum + (s.credits ?? 0), 0)
console.log(`Credits spent so far: ${total.toFixed(1)} (about ${(total * 0.005).toFixed(2)} USD)`)
if (results.some((r) => r.status === 'rejected')) process.exitCode = 1
