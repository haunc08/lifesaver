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

/** Read the story, look at the essential clues, then answer and choose correctly. */
export async function playToAct(page: Page, level: LevelDef) {
  for (let i = 1; i < level.intro.length; i++) await button(page, 'Tiếp tục').click()
  await button(page, 'Quan sát hiện trường').click()
  for (const clue of level.observe.clues.filter((c) => c.essential)) {
    await button(page, clue.label).click()
  }
  await button(page, 'Mình đã rõ rồi').click()
  await button(page, level.assess.options.find((o) => o.correct)!.text).click()
  for (const stepId of level.choose.order) {
    await button(page, level.choose.options.find((o) => o.id === stepId)!.text).click()
  }
  // The action starts by itself a moment after the last right step is picked.
  await expect(page.getByText(/^Đã chọn/)).toHaveCount(0)
}

/** Where to press for a hold mini-game. */
export async function holdPoint(page: Page, action: string) {
  const box = await button(page, `Nhấn giữ: ${action}`).boundingBox()
  if (!box) throw new Error('hold button not found')
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/** Points given in percent of the mini-game's picture, as places on the page. */
export async function scenePoints(page: Page, points: { x: number; y: number }[]) {
  const surface = page.locator('[data-surface]')
  await surface.scrollIntoViewIfNeeded()
  const box = await surface.boundingBox()
  if (!box) throw new Error('mini-game picture not found')
  return points.map((p) => ({
    x: box.x + (box.width * p.x) / 100,
    y: box.y + (box.height * p.y) / 100,
  }))
}

/** Drag round the dial's centre by this many degrees, starting at its right-hand side. */
export async function turnDial(page: Page, direction: 'cw' | 'ccw', degrees: number) {
  const dial = page.locator('[data-dial]')
  await dial.scrollIntoViewIfNeeded()
  const box = await dial.boundingBox()
  if (!box) throw new Error('dial not found')
  const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  const at = (deg: number) => {
    const rad = (deg * Math.PI) / 180
    return {
      x: centre.x + box.width * 0.36 * Math.cos(rad),
      y: centre.y + box.width * 0.36 * Math.sin(rad),
    }
  }
  await page.mouse.move(at(0).x, at(0).y)
  await page.mouse.down()
  // On a screen the angle grows clockwise.
  for (let deg = 12; deg <= degrees; deg += 12) {
    const p = at(direction === 'cw' ? deg : -deg)
    await page.mouse.move(p.x, p.y)
  }
  await page.mouse.up()
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
    case 'trace': {
      const at = await scenePoints(page, config.path)
      await page.mouse.move(at[0].x, at[0].y)
      await page.mouse.down()
      for (let i = 1; i < at.length; i++) {
        // Short steps, as a finger would make; a gentle path is also taken slowly.
        const steps = Math.ceil(Math.hypot(at[i].x - at[i - 1].x, at[i].y - at[i - 1].y) / 6)
        for (let k = 1; k <= steps; k++) {
          await page.mouse.move(
            at[i - 1].x + ((at[i].x - at[i - 1].x) * k) / steps,
            at[i - 1].y + ((at[i].y - at[i - 1].y) * k) / steps,
          )
          if (config.gentle) await page.waitForTimeout(40)
        }
      }
      await page.mouse.up()
      await expect(page.getByRole('status')).toContainText(config.doneNote)
      break
    }
    case 'rub': {
      const at = await scenePoints(page, config.spots)
      for (const [i, spot] of config.spots.entries()) {
        const row = page.getByRole('progressbar', { name: spot.label, exact: true })
        await page.mouse.move(at[i].x, at[i].y)
        await page.mouse.down()
        // Back and forth across the place until it is done.
        for (let pass = 0; pass < 12; pass++) {
          if ((await row.getAttribute('aria-valuenow')) === '100') break
          await page.mouse.move(at[i].x + (pass % 2 ? -18 : 18), at[i].y, { steps: 4 })
        }
        await page.mouse.up()
        await expect(row).toHaveAttribute('aria-valuenow', '100')
      }
      break
    }
    case 'rotate':
      await turnDial(page, config.direction, config.turns * 360 + 20)
      await expect(page.getByRole('status')).toContainText(config.doneNote)
      break
    case 'call':
      for (const digit of config.number) await button(page, digit).click()
      await button(page, 'Gọi').click()
      for (const turn of config.turns) {
        await expect(page.getByText(turn.ask)).toBeVisible()
        await button(page, turn.replies.find((r) => r.right)!.text).click()
      }
      await expect(page.getByText(config.closing)).toBeVisible()
      await button(page, 'Cúp máy').click()
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
