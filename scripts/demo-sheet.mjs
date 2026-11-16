// Builds the demo sheet: the main screens of the game, tiled with captions, as one
// picture for product documents. Run through `pnpm demo:sheet`, which first takes
// the screenshots (e2e/demo-shots.spec.ts) into e2e/.results/demo.
//   node scripts/demo-sheet.mjs [out.jpg]
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const SHOTS = resolve('e2e/.results/demo')
const OUT = resolve(process.argv[2] ?? 'docs/demo/lifesaver-screens.jpg')
/** Width of one phone on the sheet, in CSS pixels; the sheet is rendered at SCALE. */
const TILE = 300
const SCALE = 1.5

/** Rows of the sheet: each tile is a screenshot's file name, its name and a one-line note. */
const ROWS = [
  {
    title: 'Vào game',
    tiles: [
      ['town-intro', 'Giới thiệu thị trấn', 'Bông dẫn người chơi vào câu chuyện'],
      ['character', 'Tạo nhân vật', 'Chỉ cần đặt tên'],
      ['home', 'Bản đồ thị trấn', 'Trang chủ: năm khu, mỗi khu một nhóm màn'],
      ['area', 'Danh sách màn của khu', 'Số sao tốt nhất của từng màn'],
      ['unlock', 'Mở khoá bằng tay', 'Mở sẵn một khu hoặc một màn để demo'],
      ['lesson', 'Thư viện kiến thức', 'Mỗi màn chơi xong tặng một bài học'],
    ],
  },
  {
    title: 'Một màn chơi, từ câu chuyện đến lúc hành động',
    numbered: true,
    tiles: [
      ['story', 'Câu chuyện', 'Tình huống mở ra qua lời thoại'],
      ['observe', 'Quan sát hiện trường', 'Chạm vào manh mối trên tranh'],
      ['assess', 'Nhận định', 'Trả lời sai thì được giải thích'],
      ['pick', 'Chọn việc', 'Việc không an toàn bị chặn kèm lý do'],
      ['order', 'Xếp thứ tự', 'Kéo từng việc lên xuống rồi bấm Thực hiện'],
      ['order-review', 'Phản hồi thứ tự', 'Xếp sai thì game xếp lại và nói vì sao'],
    ],
  },
  {
    title: 'Mini-game',
    tiles: [
      ['trace-bandage', 'Quấn băng', 'Kéo cuộn băng theo đường chấm'],
      ['trace-stinger', 'Gạt ngòi ong', 'Gạt cạnh thẻ ngang qua vết đốt'],
      ['rub', 'Chà khăn ướt', 'Chà qua lại lên từng chỗ cần làm mát'],
      ['rotate', 'Khoá van gas', 'Xoay tròn quanh tâm, đúng chiều'],
      ['dial', 'Bấm số khẩn cấp', 'Người chơi phải tự nhớ số'],
      ['call', 'Trả lời tổng đài', 'Câu trả lời chưa tốt được giải thích'],
    ],
  },
  {
    title: 'Mini-game khác, gợi ý và kết quả',
    tiles: [
      ['scan', 'Tìm mối nguy', 'Tìm đúng hiện màu xanh kèm dấu tích'],
      ['drag', 'Kéo thả', 'Đưa từng món đồ đến đúng chỗ'],
      ['quick-decision', 'Thẻ quyết định nhanh', 'Nên làm hay không, kèm lời giải thích'],
      ['tap-targets', 'Chạm việc cần làm', 'Có việc gài bẫy, không được chạm'],
      ['hint', 'Gợi ý', 'Có ở mọi giai đoạn, đồng hồ tạm dừng'],
      ['result', 'Kết quả', 'Điểm, sao và việc nào đúng, việc nào sai'],
    ],
  },
]

const fontCss = (pack) =>
  `<link rel="stylesheet" href="${pathToFileURL(resolve(`node_modules/@fontsource-variable/${pack}/wght.css`)).href}">`

const tile = ([file, name, note], index, numbered) => {
  statSync(resolve(SHOTS, `${file}.png`)) // fail early when a picture is missing
  return `
    <figure>
      <div class="phone">
        <img src="${pathToFileURL(resolve(SHOTS, `${file}.png`)).href}" alt="">
      </div>
      <figcaption>
        <strong>${numbered ? `${index + 1}. ` : ''}${name}</strong>
        <span>${note}</span>
      </figcaption>
    </figure>`
}

// The palette and type are the game's own (src/index.css).
const html = `<!doctype html>
<html lang="vi">
<meta charset="utf-8">
${fontCss('baloo-2')}
${fontCss('nunito')}
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: max-content; padding: 56px 60px 64px;
    background: #dde9f1; color: #2f3e57;
    font-family: 'Nunito Variable', sans-serif; font-size: 16px; line-height: 1.35;
  }
  header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 12px; }
  h1 { font: 800 54px/1 'Baloo 2 Variable', sans-serif; }
  header p { font-size: 20px; color: #55637b; }
  h2 { font: 700 30px/1.1 'Baloo 2 Variable', sans-serif; margin: 44px 0 18px; }
  .row { display: grid; grid-template-columns: repeat(6, ${TILE}px); gap: 30px; }
  .phone {
    border: 5px solid #fffcf7; border-radius: 26px;
    background: #fffcf7; box-shadow: 0 6px 0 #c0d3e2;
  }
  .phone img { display: block; width: 100%; border-radius: 21px; }
  figcaption { padding: 16px 4px 0; }
  figcaption strong { display: block; font: 700 22px/1.15 'Baloo 2 Variable', sans-serif; }
  figcaption span { display: block; margin-top: 3px; color: #55637b; }
</style>
<header>
  <h1>Lifesaver</h1>
  <p>Trò chơi học sơ cứu trên điện thoại. Các màn hình chính.</p>
</header>
${ROWS.map(
  (row) => `
  <h2>${row.title}</h2>
  <div class="row">${row.tiles.map((t, i) => tile(t, i, row.numbered)).join('')}</div>`,
).join('')}
</html>`

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ deviceScaleFactor: SCALE })
// Loaded from a file, not set as content: a blank page may not read local pictures and fonts.
const pagePath = resolve(SHOTS, 'sheet.html')
writeFileSync(pagePath, html)
await page.goto(pathToFileURL(pagePath).href, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ fullPage: true })
await browser.close()

mkdirSync(dirname(OUT), { recursive: true })
const info = await sharp(png).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(OUT)
console.log(`${OUT}: ${info.width}×${info.height}, ${(info.size / 1e6).toFixed(1)} MB`)
