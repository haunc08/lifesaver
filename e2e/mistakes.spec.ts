import { expect, test } from '@playwright/test'
import {
  button,
  holdPoint,
  openLevel,
  playMinigame,
  playToAct,
  scenePoints,
  shot,
  turnDial,
} from './helpers'

/** What happens when the player gets a mini-game wrong. */

test('answering the quick-decision cards wrong ends the level without a pass', async ({ page }) => {
  const level = await openLevel(page, 'food-district-01')
  if (level.act.type !== 'quick-decision') throw new Error('expected a quick-decision level')
  const { cards, answers } = level.act
  await playToAct(page, level)

  for (const [i, card] of cards.entries()) {
    await button(page, answers[card.answer === 0 ? 1 : 0]).click()
    // The explanation is shown for a wrong answer too.
    await expect(page.getByRole('status')).toContainText(card.why)
    if (i === 0) await shot(page, 'mistake-quick-decision')
    await button(page, i === cards.length - 1 ? 'Hoàn thành' : 'Thẻ tiếp theo').click()
  }

  await expect(page.getByText(level.outcomes['recoverable-mistake'])).toBeVisible()
  await button(page, 'Xem kết quả').click()
  await expect(page.getByRole('heading', { name: 'Suýt nữa thì được' })).toBeVisible()
  await expect(page.getByLabel('0 trên 3 sao')).toBeVisible()
  await shot(page, 'mistake-result')
})

test('a quick-decision card left unanswered runs out of time and counts as wrong', async ({
  page,
}) => {
  const level = await openLevel(page, 'food-district-01')
  if (level.act.type !== 'quick-decision') throw new Error('expected a quick-decision level')
  await playToAct(page, level)
  await expect(page.getByRole('status')).toContainText('Hết giờ!', {
    timeout: level.act.secPerCard * 1000 + 3000,
  })
})

test('letting go of a hold early loses progress, and the hold can still be finished', async ({
  page,
}) => {
  const level = await openLevel(page, 'dormitory-01')
  const [hold, wrap] = level.act.type === 'sequence' ? level.act.steps : []
  if (hold?.type !== 'hold' || !wrap) throw new Error('expected a hold, then one more step')
  const { action, releaseText } = hold
  await playToAct(page, level)

  const at = await holdPoint(page, action)
  await page.mouse.move(at.x, at.y)
  await page.mouse.down()
  await page.waitForTimeout(1200)
  await page.mouse.up()
  await expect(page.getByRole('status')).toContainText(releaseText)
  await shot(page, 'mistake-hold')

  await page.mouse.down()
  await expect(page.getByText('✓ Xong rồi!')).toBeVisible({ timeout: 15_000 })
  await page.mouse.up()
  await playMinigame(page, wrap)
  await button(page, 'Xem kết quả').click()
  // One early release is forgiven, so this is still a clean pass.
  await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
})

test('tapping a harmless spot in a scan is explained and the scan can still be finished', async ({
  page,
}) => {
  const level = await openLevel(page, 'dormitory-02')
  const [scan] = level.act.type === 'sequence' ? level.act.steps : []
  if (scan?.type !== 'scan') throw new Error('expected a level that starts with a scan')
  const { spots } = scan
  await playToAct(page, level)

  const harmless = spots.find((s) => !s.hazard)!
  await button(page, harmless.label).click()
  await expect(page.getByRole('status')).toContainText(harmless.note)
  const row = (label: string) => page.getByRole('button', { name: new RegExp(`^${label}`) })
  await expect(row(harmless.label)).toContainText('Không phải mối nguy')
  // A hazard that was found is marked as a right answer, not as a mistake.
  const hazard = spots.find((s) => s.hazard)!
  await button(page, hazard.label).click()
  await expect(row(hazard.label)).toContainText('Đúng, đây là mối nguy')
  await shot(page, 'scan-found')
  for (const s of spots.filter((x) => x.hazard && x !== hazard)) await button(page, s.label).click()
  await expect(page.getByText('Bước 2/3')).toBeVisible()
})

test('a bandage that leaves the path stops, and can be picked up again', async ({ page }) => {
  const level = await openLevel(page, 'streets-02')
  const steps = level.act.type === 'sequence' ? level.act.steps : []
  const wrap = steps[2]
  if (wrap?.type !== 'trace') throw new Error('expected the third step to be a trace')
  await playToAct(page, level)
  await playMinigame(page, steps[0])
  await playMinigame(page, steps[1])

  const [start, bend] = await scenePoints(page, wrap.path)
  const bar = page.getByRole('slider', { name: wrap.tool.label })

  // Pressing away from the roll does not start anything.
  await page.mouse.move(start.x + 150, start.y + 120)
  await page.mouse.down()
  await page.mouse.move(start.x + 160, start.y + 130, { steps: 3 })
  await page.mouse.up()
  await expect(bar).toHaveAttribute('aria-valuenow', '0')

  // Straight across the arm instead of down the first pass: the bandage stays behind.
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + (bend.x - start.x) / 2, start.y + (bend.y - start.y) / 2, {
    steps: 8,
  })
  await page.mouse.move(start.x + 150, start.y + (bend.y - start.y) / 2, { steps: 12 })
  await expect(page.getByRole('status')).toContainText(wrap.slipNote)
  await page.mouse.up()
  const share = Number(await bar.getAttribute('aria-valuenow'))
  expect(share).toBeGreaterThan(3)
  expect(share).toBeLessThan(20)
  await shot(page, 'mistake-trace')

  // Picking the roll up where it stopped finishes the job.
  const here = await page.locator('[data-tool]').boundingBox()
  await page.mouse.move(here!.x + here!.width / 2, here!.y + here!.height / 2)
  await page.mouse.down()
  await page.mouse.move(bend.x, bend.y, { steps: 10 })
  await page.mouse.up()
  await playMinigame(page, { ...wrap, path: wrap.path.slice(1) })
  await button(page, 'Xem kết quả').click()
  await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
})

test('pulling the ring off fast is refused; slowly works', async ({ page }) => {
  const level = await openLevel(page, 'food-district-02')
  const steps = level.act.type === 'sequence' ? level.act.steps : []
  const ring = steps[1]
  if (ring?.type !== 'trace' || !ring.gentle) throw new Error('expected a gentle trace')
  await playToAct(page, level)
  await playMinigame(page, steps[0])

  const [from, to] = await scenePoints(page, ring.path)
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  // The whole finger in about a fifth of a second.
  for (let k = 1; k <= 8; k++) {
    await page.mouse.move(from.x + ((to.x - from.x) * k) / 8, from.y + ((to.y - from.y) * k) / 8)
    await page.waitForTimeout(25)
  }
  await page.mouse.up()
  await expect(page.getByRole('status')).toContainText(ring.slipNote)
  await shot(page, 'mistake-gentle')

  // From where the ring stopped, slowly this time.
  const here = await page.locator('[data-tool]').boundingBox()
  const start = { x: here!.x + here!.width / 2, y: here!.y + here!.height / 2 }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  const steps2 = Math.ceil(Math.hypot(to.x - start.x, to.y - start.y) / 6)
  for (let k = 1; k <= steps2; k++) {
    await page.mouse.move(
      start.x + ((to.x - start.x) * k) / steps2,
      start.y + ((to.y - start.y) * k) / steps2,
    )
    await page.waitForTimeout(40)
  }
  await page.mouse.up()
  await expect(page.getByRole('status')).toContainText(ring.doneNote)
})

test('the gas valve refuses the wrong way, and a wrong number or reply is explained', async ({
  page,
}) => {
  const level = await openLevel(page, 'dormitory-02')
  const steps = level.act.type === 'sequence' ? level.act.steps : []
  const [scan, valve, call] = steps
  if (valve?.type !== 'rotate' || call?.type !== 'call') throw new Error('expected rotate, call')
  await playToAct(page, level)
  await playMinigame(page, scan)

  // Anticlockwise opens the valve: refused, and nothing is gained.
  const dial = page.getByRole('slider', { name: `Xoay: ${valve.dial.label}` })
  await turnDial(page, 'ccw', 120)
  await expect(page.getByRole('status')).toContainText(valve.wrongWayNote)
  await expect(dial).toHaveAttribute('aria-valuenow', '0')
  await shot(page, 'mistake-rotate')
  await playMinigame(page, valve)

  // 115 is the ambulance, not the fire service.
  for (const digit of '115') await button(page, digit).click()
  await button(page, 'Gọi').click()
  await expect(page.getByRole('status')).toContainText('115 là số gọi cấp cứu y tế')
  await shot(page, 'mistake-dial')
  for (const digit of call.number) await button(page, digit).click()
  await button(page, 'Gọi').click()

  // An unhelpful reply is explained and crossed out; the question stays.
  const first = call.turns[0]
  const poor = first.replies.find((r) => !r.right)!
  await button(page, poor.text).click()
  await expect(page.getByRole('status')).toContainText(poor.why)
  await expect(page.getByText('Câu hỏi 1/4')).toBeVisible()
  await shot(page, 'mistake-call')
  for (const turn of call.turns) await button(page, turn.replies.find((r) => r.right)!.text).click()
  await shot(page, 'call-closing')
  await button(page, 'Cúp máy').click()
  await button(page, 'Xem kết quả').click()
  await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
})
