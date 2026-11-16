import { expect, test, type Page } from '@playwright/test'
import type { ScenePoint } from '../src/game/types'
import {
  button,
  openLevel,
  planRow,
  playMinigame,
  playToAct,
  scenePoints,
  turnDial,
} from './helpers'

/**
 * Takes the pictures for the demo sheet (docs/demo). Not part of the test run:
 * the config leaves this file out unless DEMO is set. Run `pnpm demo:sheet`.
 * Many pictures are taken in the middle of an action, with the pointer still down.
 */

test.use({ deviceScaleFactor: 2 })

const snap = (page: Page, name: string) =>
  page.screenshot({ path: `e2e/.results/demo/${name}.png`, animations: 'disabled' })

const stepsOf = (level: Awaited<ReturnType<typeof openLevel>>) =>
  level.act.type === 'sequence' ? level.act.steps : [level.act]

/** A save part of the way through the first area. */
function seedProgress(page: Page) {
  const save = {
    state: {
      profile: { name: 'Nhi' },
      introSeen: true,
      xp: 190,
      records: {
        'school-01': { cleared: true, bestScore: 96, stars: 3, plays: 2 },
        'school-02': { cleared: true, bestScore: 82, stars: 2, plays: 1 },
      },
      lessons: ['lesson-school-01', 'lesson-school-02'],
      opened: [],
      settings: { music: true, sfx: true },
    },
    version: 2,
  }
  return page.addInitScript((value) => {
    localStorage.setItem('lifesaver-save', value)
  }, JSON.stringify(save))
}

/** Press on the start of a path and follow this share of it, without letting go. */
async function followPart(page: Page, path: ScenePoint[], share: number) {
  const at = await scenePoints(page, path)
  const lengths = at.slice(1).map((p, i) => Math.hypot(p.x - at[i].x, p.y - at[i].y))
  let left = lengths.reduce((a, b) => a + b, 0) * share
  await page.mouse.move(at[0].x, at[0].y)
  await page.mouse.down()
  for (const [i, length] of lengths.entries()) {
    const part = Math.min(1, left / length)
    const steps = Math.ceil((length * part) / 6)
    for (let k = 1; k <= steps; k++) {
      const t = (part * k) / steps
      await page.mouse.move(
        at[i].x + (at[i + 1].x - at[i].x) * t,
        at[i].y + (at[i + 1].y - at[i].y) * t,
      )
    }
    left -= length
    if (left <= 0) break
  }
}

test('first launch', async ({ page }) => {
  await page.goto('/')
  await button(page, 'Tiếp tục').click()
  await button(page, 'Tiếp tục').click()
  await expect(button(page, 'Bắt đầu')).toBeVisible()
  await snap(page, 'town-intro')
  await button(page, 'Bắt đầu').click()
  await page.getByLabel('Tên nhân vật').fill('Nhi')
  await snap(page, 'character')
})

test('home, area, unlocking and a lesson', async ({ page }) => {
  await seedProgress(page)
  await page.goto('/lobby')
  await expect(button(page, 'Chơi: Trận bóng chiều thứ sáu')).toBeVisible()
  await snap(page, 'home')
  await button(page, 'Ký túc xá, đang khoá').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await snap(page, 'unlock')
  await page.goto('/area/school')
  await expect(page.getByRole('heading', { name: 'Trường học' })).toBeVisible()
  await snap(page, 'area')
  await page.goto('/library/lesson-school-01')
  await expect(page.getByRole('heading', { name: 'Ngất xỉu' })).toBeVisible()
  await snap(page, 'lesson')
})

test('a level from the story to the order of the steps', async ({ page }) => {
  const level = await openLevel(page, 'school-01')
  const { options } = level.choose
  await expect(button(page, 'Tiếp tục')).toBeVisible()
  await snap(page, 'story')
  for (let i = 1; i < level.intro.length; i++) await button(page, 'Tiếp tục').click()
  await button(page, 'Quan sát hiện trường').click()
  for (const clue of level.observe.clues.filter((c) => c.essential)) {
    await button(page, clue.label).click()
  }
  await snap(page, 'observe')
  await button(page, 'Mình đã rõ rồi').click()

  // One wrong answer, so that its explanation shows.
  await button(page, level.assess.options.find((o) => !o.correct)!.text).click()
  await expect(page.getByRole('status')).toBeVisible()
  await snap(page, 'assess')
  await button(page, level.assess.options.find((o) => o.correct)!.text).click()

  // Picking: one unsafe option refused, two right steps picked.
  const right = options.filter((o) => o.kind === 'correct')
  await button(page, options.find((o) => o.kind === 'unsafe')!.text).click()
  for (const o of right.slice(0, 2)) await button(page, o.text).click()
  await snap(page, 'pick')
  for (const o of right.slice(2)) await button(page, o.text).click()

  // Ordering: the last row is being dragged up.
  await expect(page.getByRole('heading', { name: 'Việc nào làm trước?' })).toBeVisible()
  const box = await planRow(page, right[right.length - 1].id).boundingBox()
  if (!box) throw new Error('plan row not found')
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  for (let k = 1; k <= 10; k++) await page.mouse.move(x, y - k * 5)
  await snap(page, 'order')
  await page.mouse.up()

  // Carried out in a wrong order: the review shows the right one.
  await button(page, 'Thực hiện').click()
  await expect(page.getByRole('status')).toContainText('Thứ tự chưa hợp lý')
  await page.waitForTimeout(600)
  await snap(page, 'order-review')
  await button(page, 'Tiếp tục').click()

  // Tap the targets: a decoy refused and two things done; then the hint.
  if (level.act.type !== 'tap-targets') throw new Error('expected tap-targets')
  await button(page, level.act.decoys[0].label).tap()
  for (const t of level.act.targets.slice(0, 2)) await button(page, t.label).tap()
  await snap(page, 'tap-targets')
  await button(page, 'Gợi ý').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await snap(page, 'hint')
})

test('a result with three stars', async ({ page }) => {
  const level = await openLevel(page, 'school-01')
  await playToAct(page, level)
  for (const step of stepsOf(level)) await playMinigame(page, step)
  await button(page, 'Xem kết quả').click()
  await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
  await page.waitForTimeout(2200) // the score counts up and the stars land
  await snap(page, 'result')
})

test('wrapping a bandage along the dotted path', async ({ page }) => {
  const level = await openLevel(page, 'school-03')
  const [place, wrap] = stepsOf(level)
  if (wrap?.type !== 'trace') throw new Error('expected a trace')
  await playToAct(page, level)
  await playMinigame(page, place)
  await expect(page.getByText('Bước 2/2')).toBeVisible()
  await followPart(page, wrap.path, 0.62)
  await snap(page, 'trace-bandage')
  await page.mouse.up()
})

test('scraping a stinger off', async ({ page }) => {
  const level = await openLevel(page, 'park-02')
  const [scrape] = stepsOf(level)
  if (scrape.type !== 'trace') throw new Error('expected a trace')
  await playToAct(page, level)
  await followPart(page, scrape.path, 0.3)
  await snap(page, 'trace-stinger')
  await page.mouse.up()
})

test('rubbing with a wet towel', async ({ page }) => {
  const level = await openLevel(page, 'park-01')
  const [place, rub] = stepsOf(level)
  if (rub?.type !== 'rub') throw new Error('expected a rub')
  await playToAct(page, level)
  await playMinigame(page, place)
  await expect(page.getByText('Bước 2/2')).toBeVisible()
  const at = await scenePoints(page, rub.spots)
  // The first place is finished, the second is half done with the towel still on it.
  for (const [i, passes] of [12, 3].entries()) {
    const row = page.getByRole('progressbar', { name: rub.spots[i].label, exact: true })
    await page.mouse.move(at[i].x, at[i].y)
    await page.mouse.down()
    for (let pass = 0; pass < passes; pass++) {
      if ((await row.getAttribute('aria-valuenow')) === '100') break
      await page.mouse.move(at[i].x + (pass % 2 ? -18 : 18), at[i].y, { steps: 4 })
    }
    if (i === 0) await page.mouse.up()
  }
  await snap(page, 'rub')
  await page.mouse.up()
})

test('the gas valve and the call to 114', async ({ page }) => {
  const level = await openLevel(page, 'dormitory-02')
  const [scan, valve, call] = stepsOf(level)
  if (valve?.type !== 'rotate' || call?.type !== 'call') throw new Error('expected rotate, call')
  await playToAct(page, level)
  await playMinigame(page, scan)

  await expect(page.getByText('Bước 2/3')).toBeVisible()
  await turnDial(page, valve.direction, 440)
  await snap(page, 'rotate')
  await playMinigame(page, valve)

  await expect(page.getByText('Bước 3/3')).toBeVisible()
  for (const digit of call.number) await button(page, digit).click()
  await snap(page, 'dial')
  await button(page, 'Gọi').click()

  // One good reply, then an unhelpful one with its explanation.
  const [first, second] = call.turns
  await button(page, first.replies.find((r) => r.right)!.text).click()
  await expect(page.getByText(second.ask)).toBeVisible()
  const poor = second.replies.find((r) => !r.right)!
  await button(page, poor.text).click()
  await expect(page.getByRole('status')).toContainText(poor.why)
  await snap(page, 'call')
})

test('scanning for hazards', async ({ page }) => {
  const level = await openLevel(page, 'streets-01')
  const [scan] = stepsOf(level)
  if (scan.type !== 'scan') throw new Error('expected a scan')
  await playToAct(page, level)
  const hazards = scan.spots.filter((s) => s.hazard)
  await button(page, scan.spots.find((s) => !s.hazard)!.label).click()
  for (const s of hazards.slice(0, 2)) await button(page, s.label).click()
  await snap(page, 'scan')
})

test('dragging an item to its place', async ({ page }) => {
  const level = await openLevel(page, 'school-02')
  if (level.act.type !== 'drag-place') throw new Error('expected drag-place')
  const { items, zones } = level.act
  await playToAct(page, level)
  const [first, second] = items.filter((i) => i.zoneId !== null)
  const zoneOf = (id: string | null) =>
    page.getByRole('button', { name: `Vị trí: ${zones.find((z) => z.id === id)!.label}` })
  await button(page, first.label).click()
  await zoneOf(first.zoneId).click()

  const from = await button(page, second.label).boundingBox()
  const to = await zoneOf(second.zoneId).boundingBox()
  if (!from || !to) throw new Error('item or zone not found')
  const start = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
  const end = { x: to.x + to.width / 2, y: to.y + to.height / 2 }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  // Most of the way there, so the item is seen in the air.
  await page.mouse.move(start.x + (end.x - start.x) * 0.75, start.y + (end.y - start.y) * 0.75, {
    steps: 8,
  })
  await snap(page, 'drag')
  await page.mouse.up()
})

test('a quick-decision card with its explanation', async ({ page }) => {
  const level = await openLevel(page, 'food-district-01')
  if (level.act.type !== 'quick-decision') throw new Error('expected quick-decision')
  const { cards, answers } = level.act
  await playToAct(page, level)
  await button(page, answers[cards[0].answer]).click()
  await expect(page.getByRole('status')).toContainText(cards[0].why)
  await snap(page, 'quick-decision')
})
