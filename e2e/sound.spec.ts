import { expect, test, type Page } from '@playwright/test'
import { button, seedSave } from './helpers'

/** Sound cannot be heard in a test, but the engine's state can be read. */

function status(page: Page) {
  return page.evaluate(async () => {
    const path = '/src/audio/index.ts'
    const { audioStatus } = await import(/* @vite-ignore */ path)
    return audioStatus() as {
      unlocked: boolean
      effectsLoaded: string[]
      track: string | null
      musicPlaying: boolean
    }
  })
}

test('sound starts on the first tap, follows the screen and obeys the settings', async ({
  page,
}) => {
  await seedSave(page)
  await page.goto('/lobby')
  await expect(button(page, 'Cài đặt')).toBeVisible()

  // Nothing before the first tap.
  expect((await status(page)).unlocked).toBe(false)

  // The first tap starts the town music and loads every effect.
  await button(page, 'Cài đặt').click()
  await expect.poll(async () => (await status(page)).effectsLoaded.length).toBe(10)
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)
  expect((await status(page)).track).toBe('town')

  // The music switch stops and restarts it.
  await page.getByRole('switch', { name: 'Nhạc và tiếng nền' }).click()
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(false)
  await page.getByRole('switch', { name: 'Nhạc và tiếng nền' }).click()
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)

  // An area's level list is still a menu: the town tune goes on.
  await button(page, 'Quay lại').click()
  await button(page, 'Trường học, đã qua 3 trên 3 màn').click()
  await expect(page.getByRole('heading', { name: 'Trường học' })).toBeVisible()
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)
  expect((await status(page)).track).toBe('town')
  // Inside a level, the sound of its place plays instead.
  await button(page, /Tiết bốn oi ả/).click()
  await expect.poll(async () => (await status(page)).track).toBe('ambience-school')
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)

  // Each area has its own recording, and the town tune comes back outside.
  for (const area of ['dormitory', 'streets', 'food-district', 'park']) {
    await page.goto(`/level/${area}-01`)
    await page.getByRole('progressbar', { name: 'Tiến trình màn chơi' }).click()
    await expect.poll(async () => (await status(page)).track).toBe(`ambience-${area}`)
    await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)
  }
  await page.goto('/lobby')
  await button(page, 'Cài đặt').click()
  await expect.poll(async () => (await status(page)).track).toBe('town')
})
