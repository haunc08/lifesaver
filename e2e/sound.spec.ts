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
  await page.getByRole('switch', { name: 'Nhạc nền' }).click()
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(false)
  await page.getByRole('switch', { name: 'Nhạc nền' }).click()
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)

  // Inside a level the calmer track plays.
  await button(page, 'Quay lại').click()
  await button(page, 'Trường học, đã qua 3 trên 3 màn').click()
  await button(page, /Tiết bốn oi ả/).click()
  await expect.poll(async () => (await status(page)).track).toBe('level')
  await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)
})
