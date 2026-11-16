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
      await page.locator('[data-zoomed]').click({ position: { x: 8, y: 8 } })
      await expect(page.locator('[data-zoomed]')).toHaveCount(0)
    }
    await shot(page, `${id}-observe`)
    await button(page, 'Mình đã rõ rồi').click()

    // Assess and choose.
    await button(page, level.assess.options.find((o) => o.correct)!.text).click()
    for (const stepId of level.choose.order) {
      await button(page, level.choose.options.find((o) => o.id === stepId)!.text).click()
    }
    await button(page, 'Thực hiện').click()

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
  })
}

test('drag-and-place also works by dragging, and refuses a decoy', async ({ page }) => {
  const level = await openLevel(page, 'park-01')
  if (level.act.type !== 'drag-place') throw new Error('park-01 should be drag-and-place')
  const { items, zones } = level.act
  await playToAct(page, level)

  const centre = async (name: string) => {
    const box = await page.getByRole('button', { name, exact: true }).boundingBox()
    if (!box) throw new Error(`${name} not found`)
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  }
  const drag = async (itemLabel: string, zoneLabel: string) => {
    const from = await centre(itemLabel)
    const to = await centre(`Vị trí: ${zoneLabel}`)
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(to.x, to.y, { steps: 8 })
    await page.mouse.up()
  }

  // A decoy dropped on a zone is refused and explained.
  const decoy = items.find((i) => i.zoneId === null)!
  await drag(decoy.label, zones[0].label)
  await expect(page.getByRole('status')).toContainText(decoy.wrongNote)
  await expect(button(page, decoy.label)).toBeDisabled()

  // Every real item can be dragged to its zone.
  for (const item of items.filter((i) => i.zoneId !== null)) {
    await drag(item.label, zones.find((z) => z.id === item.zoneId)!.label)
  }
  await button(page, 'Xem kết quả').click()
  await expect(page.getByText(/\/ 100/)).toBeVisible()
})
