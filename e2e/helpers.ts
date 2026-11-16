import { expect, type Page } from '@playwright/test'
import type { LevelDef, SingleMinigameConfig } from '../src/game/types'

/** Shared steps for the end-to-end tests. */

export const LEVEL_IDS = [
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

/** Set SHOTS=1 to save a screenshot into e2e/.results/shots, with animations finished. */
export async function shot(page: Page, name: string) {
  if (process.env.SHOTS)
    await page.screenshot({ path: `e2e/.results/shots/${name}.png`, animations: 'disabled' })
}

export const button = (page: Page, name: string | RegExp) =>
  page.getByRole('button', { name, exact: true })

/** A save in which every level is already cleared, so any level can be opened. */
export function seedSave(page: Page) {
  const records = Object.fromEntries(
    LEVEL_IDS.map((id) => [id, { cleared: true, bestScore: 80, stars: 2, plays: 1 }]),
  )
  // Version 1 on purpose: loading it also exercises the save migration.
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

/** Open a level and read its definition from the app, so tests follow the real content. */
export async function openLevel(page: Page, id: string): Promise<LevelDef> {
  await seedSave(page)
  await page.goto(`/level/${id}`)
  return page.evaluate(async (levelId) => {
    const path = '/src/content/levels/index.ts'
    const { LEVELS } = await import(/* @vite-ignore */ path)
    return LEVELS[levelId]
  }, id)
}

/** Read the story, look at the required clues, then answer and choose correctly. */
export async function playToAct(page: Page, level: LevelDef) {
  for (let i = 1; i < level.intro.length; i++) await button(page, 'Tiếp tục').click()
  await button(page, 'Quan sát hiện trường').click()
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
}

/** Where to press for a hold mini-game. */
export async function holdPoint(page: Page, action: string) {
  const box = await button(page, `Nhấn giữ: ${action}`).boundingBox()
  if (!box) throw new Error('hold button not found')
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

export async function playMinigame(page: Page, config: SingleMinigameConfig) {
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
