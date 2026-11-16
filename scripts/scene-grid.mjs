// Dev helper: writes art/raw/_grid-<id>.jpg, the scene with a 10% grid over it, to read
// off percent positions for clues and mini-game markers. If art/raw/_marks-<id>.json
// exists ([{ tag, x, y, color }]), those markers are drawn too.
//   node scripts/scene-grid.mjs <level-id>…
import { existsSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

const W = 880
const H = 660
for (const id of process.argv.slice(2)) {
  const file = `art/raw/_marks-${id}.json`
  const marks = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : []
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="sans-serif">`
  for (let i = 1; i < 10; i++) {
    svg += `<line x1="${(W * i) / 10}" y1="0" x2="${(W * i) / 10}" y2="${H}" stroke="#000" stroke-opacity=".35"/>`
    svg += `<line x1="0" y1="${(H * i) / 10}" x2="${W}" y2="${(H * i) / 10}" stroke="#000" stroke-opacity=".35"/>`
    svg += `<text x="${(W * i) / 10 + 2}" y="12" font-size="12" fill="#000">${i * 10}</text>`
    svg += `<text x="2" y="${(H * i) / 10 - 2}" font-size="12" fill="#000">${i * 10}</text>`
  }
  for (const m of marks) {
    const x = (m.x / 100) * W
    const y = (m.y / 100) * H
    svg += `<circle cx="${x}" cy="${y}" r="26" fill="${m.color}" fill-opacity=".55" stroke="#000"/>`
    svg += `<text x="${x}" y="${y + 4}" font-size="13" font-weight="bold" text-anchor="middle" fill="#000">${m.tag}</text>`
  }
  svg += '</svg>'
  await sharp(`src/assets/art/${id}.webp`)
    .resize(W, H, { fit: 'fill' })
    .composite([{ input: Buffer.from(svg) }])
    .jpeg({ quality: 70 })
    .toFile(`art/raw/_grid-${id}.jpg`)
}
