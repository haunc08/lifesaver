import { expect, test } from '@playwright/test'
import { button, holdPoint, openLevel, playToAct, shot } from './helpers'

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
  if (level.act.type !== 'hold') throw new Error('expected a hold level')
  const { action, releaseText } = level.act
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
  await button(page, 'Xem kết quả').click()
  // One early release is forgiven, so this is still a clean pass.
  await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
})

test('tapping a harmless spot in a scan is explained and the scan can still be finished', async ({
  page,
}) => {
  const level = await openLevel(page, 'dormitory-02')
  if (level.act.type !== 'scan') throw new Error('expected a scan level')
  const { spots } = level.act
  await playToAct(page, level)

  const harmless = spots.find((s) => !s.hazard)!
  await button(page, harmless.label).click()
  await expect(page.getByRole('status')).toContainText(harmless.note)
  for (const s of spots.filter((x) => x.hazard)) await button(page, s.label).click()
  await button(page, 'Xem kết quả').click()
  await expect(page.getByText(/\/ 100/)).toBeVisible()
})
