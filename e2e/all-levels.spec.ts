import { expect, test } from '@playwright/test'
import { button, LEVEL_IDS, openLevel, playMinigame, playToAct, shot } from './helpers'

/**
 * Plays every level through the real interface with the right answers, so each
 * mini-game mechanic and each level's data is exercised end to end.
 */

for (const id of LEVEL_IDS) {
  test(`${id} can be cleared with the right answers`, async ({ page }) => {
    const level = await openLevel(page, id)

    // Intro.
    for (let i = 1; i < level.intro.length; i++) await button(page, 'Tiếp tục').click()
    await button(page, 'Quan sát hiện trường').click()

    // Observe: every clue marker sits inside the scene and can be opened.
    for (const clue of level.observe.clues) {
      await button(page, clue.label).click()
      await expect(page.getByText(clue.caption)).toBeVisible()
    }
    await shot(page, `${id}-observe`)
    await button(page, 'Mình đã rõ rồi').click()

    // Assess and choose.
    await button(page, level.assess.options.find((o) => o.correct)!.text).click()
    for (const stepId of level.choose.order) {
      await button(page, level.choose.options.find((o) => o.id === stepId)!.text).click()
    }
    // The round ends by itself once the plan is complete; there is nothing to confirm.
    await expect(page.getByText(/^Đã chọn/)).toHaveCount(0)

    // Act.
    await shot(page, `${id}-act`)
    const steps = level.act.type === 'sequence' ? level.act.steps : [level.act]
    for (const [i, step] of steps.entries()) {
      if (steps.length > 1)
        await expect(page.getByText(`Bước ${i + 1}/${steps.length}`)).toBeVisible()
      if (i > 0) await shot(page, `${id}-act-${i + 1}`)
      await playMinigame(page, step)
    }

    // Outcome and result.
    await button(page, 'Xem kết quả').click()
    await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
    await expect(page.getByText(level.lesson.callForHelp[0])).toBeVisible()
    await shot(page, `${id}-result`)

    // Within an area, "next" starts the next level. After an area's last level it
    // opens the new area instead of dropping the player into its first level.
    const next = LEVEL_IDS[LEVEL_IDS.indexOf(id) + 1]
    const areaOf = (levelId: string) => levelId.replace(/-\d\d$/, '')
    if (next && areaOf(next) !== areaOf(id)) {
      await page.getByRole('button', { name: /^Đến khu mới/ }).click()
      await expect(page).toHaveURL(new RegExp(`/area/${areaOf(next)}$`))
    } else if (next) {
      await expect(button(page, 'Màn tiếp theo')).toBeVisible()
    } else {
      await expect(button(page, 'Về danh sách màn')).toBeVisible()
    }
  })
}

test('a dragged item follows the pointer, lands in the nearest slot, and a decoy is refused', async ({
  page,
}) => {
  const level = await openLevel(page, 'park-01')
  if (level.act.type !== 'drag-place') throw new Error('park-01 should be drag-and-place')
  const { items, zones } = level.act
  await playToAct(page, level)

  const centre = async (name: string) => {
    const box = await page.getByRole('button', { name, exact: true }).boundingBox()
    if (!box) throw new Error(`${name} not found`)
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  }
  /** Drag an item and let go `miss` pixels to the side of the slot's centre. */
  const drag = async (itemLabel: string, zoneLabel: string, miss = 0) => {
    const from = await centre(itemLabel)
    const to = await centre(`Vị trí: ${zoneLabel}`)
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(to.x + miss, to.y, { steps: 8 })
    await page.mouse.up()
  }

  // While it is dragged, the item's picture travels with the pointer.
  const first = items.find((i) => i.zoneId !== null)!
  const start = await centre(first.label)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x - 60, start.y - 150, { steps: 6 })
  const ghost = await page.locator('body > span[aria-hidden] img').boundingBox()
  expect(ghost).not.toBeNull()
  expect(Math.abs(ghost!.x + ghost!.width / 2 - (start.x - 60))).toBeLessThan(3)
  expect(Math.abs(ghost!.y + ghost!.height / 2 - (start.y - 150))).toBeLessThan(3)
  await shot(page, 'drag-in-progress')
  // Let go away from every slot: nothing happens and the item is back in the tray.
  await page.mouse.move(8, start.y - 150)
  await page.mouse.up()
  await expect(page.locator('body > span[aria-hidden]')).toHaveCount(0)
  await expect(button(page, first.label)).toBeVisible()

  // A decoy dropped on a zone is refused and explained.
  const decoy = items.find((i) => i.zoneId === null)!
  await drag(decoy.label, zones[0].label)
  await expect(page.getByRole('status')).toContainText(decoy.wrongNote)
  // Once tried, the decoy is gone from the tray.
  await expect(button(page, decoy.label)).toHaveCount(0)

  // Every real item can be dragged to its zone, also when it is let go a little off-centre:
  // it lands in the nearest slot.
  for (const item of items.filter((i) => i.zoneId !== null)) {
    await drag(item.label, zones.find((z) => z.id === item.zoneId)!.label, 30)
  }
  await button(page, 'Xem kết quả').click()
  await expect(page.getByText(/\/ 100/)).toBeVisible()
})
