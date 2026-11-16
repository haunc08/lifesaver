// Dev helper: tiles screenshots side by side for a quick visual review.
//   node scripts/contact-sheet.mjs <out.jpg> <image>…
import sharp from 'sharp'

const [out, ...files] = process.argv.slice(2)
const W = 330
const H = 714
const tiles = await Promise.all(
  files.map(async (file, i) => ({
    input: await sharp(file).resize(W, H, { fit: 'contain', background: '#fff' }).toBuffer(),
    left: i * (W + 8),
    top: 0,
  })),
)
await sharp({
  create: { width: files.length * (W + 8) - 8, height: H, channels: 3, background: '#888' },
})
  .composite(tiles)
  .jpeg({ quality: 78 })
  .toFile(out)
