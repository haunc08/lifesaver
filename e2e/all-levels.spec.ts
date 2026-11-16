import { expect, test, type Page } from '@playwright/test'
import type { LevelDef, SingleMinigameConfig } from '../src/game/types'

/**
 * Plays every level through the real interface with the right answers, so each
 * mini-game mechanic and each level's data is exercised end to end.
 */

const LEVEL_IDS = [
  'school-01',
  'school-02',
  'school-03',
  'dormitory-01',
  'dormitory-02',
  'streets-01',
  'streets-02',
  'food-district-01',
  'food-district-02',
  'park-01',
  'park-02',
  'park-03',
]

async function shot(page: Page, name: string) {
  if (process.env.SHOTS) await page.screenshot({ path: `e2e/.results/shots/${name}.png` })
}

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })

/** A save in which every level is already cleared, so any level can be opened. */
function seedSave(page: Page) {
  const records = Object.fromEntries(
    LEVEL_IDS.map((id) => [id, { cleared: true, bestScore: 80, stars: 2, plays: 1 }]),
  )
  const save = {
    state: {
      profile: { name: 'Minh' },
      introSeen: true,
      xp: 600,
      records,
      lessons: [],
      settings: { music: true, sfx: true },
    },
    version: 1,
  }
  return page.addInitScript((value) => {
    localStorage.setItem('lifesaver-save', value)
  }, JSON.stringify(save))
}

async function playMinigame(page: Page, config: SingleMinigameConfig) {
  switch (config.type) {
    case 'tap-targets':
      for (const t of config.targets) await button(page, t.label).tap()
      break
    case 'scan':
      for (const s of config.spots.filter((x) => x.hazard)) await button(page, s.label).click()
      break
    case 'hold': {
      const box = await button(page, `Nhấn giữ: ${config.action}`).boundingBox()
      if (!box) throw new Error('hold button not found')
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await expect(page.getByText('✓ Xong rồi!')).toBeVisible({ timeout: 15_000 })
      await page.mouse.up()
      break
    }
    case 'drag-place':
      for (const item of config.items.filter((i) => i.zoneId !== null)) {
        const zone = config.zones.find((z) => z.id === item.zoneId)!
        await button(page, item.label).click()
        await page.getByRole('button', { name: `Vị trí: ${zone.label}` }).click()
      }
      break
    case 'quick-decision':
      for (const [i, card] of config.cards.entries()) {
        await expect(page.getByText(`Thẻ ${i + 1}/${config.cards.length}`)).toBeVisible()
        await button(page, config.answers[card.answer]).click()
        await button(page, i === config.cards.length - 1 ? 'Hoàn thành' : 'Thẻ tiếp theo').click()
      }
      break
  }
}

for (const id of LEVEL_IDS) {
  test(`${id} can be cleared with the right answers`, async ({ page }) => {
    await seedSave(page)
    await page.goto(`/level/${id}`)
    const level: LevelDef = await page.evaluate(async (levelId) => {
      const path = '/src/content/levels/index.ts'
      const { LEVELS } = await import(/* @vite-ignore */ path)
      return LEVELS[levelId]
    }, id)

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
  await seedSave(page)
  await page.goto('/level/park-01')
  const level: LevelDef = await page.evaluate(async () => {
    const path = '/src/content/levels/index.ts'
    const { LEVELS } = await import(/* @vite-ignore */ path)
    return LEVELS['park-01']
  })
  if (level.act.type !== 'drag-place') throw new Error('park-01 should be drag-and-place')
  const { items, zones } = level.act

  await button(page, 'Bỏ qua').click()
  for (const clue of level.observe.clues.slice(0, level.observe.required)) {
    await button(page, clue.label).click()
    await page.locator('[data-zoomed]').click({ position: { x: 8, y: 8 } })
  }
  await button(page, 'Mình đã rõ rồi').click()
  await button(page, level.assess.options.find((o) => o.correct)!.text).click()
  for (const stepId of level.choose.order) {
    await button(page, level.choose.options.find((o) => o.id === stepId)!.text).click()
  }
  await button(page, 'Thực hiện').click()

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
