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

  // Each area has its own recording; a level set somewhere unlike the rest of its
  // area (the library, the football pitch, the park at midday) has its own.
  const places = {
    'school-02': 'school-02',
    'school-03': 'school-03',
    'dormitory-01': 'dormitory',
    'dormitory-02': 'dormitory',
    'streets-01': 'streets',
    'food-district-01': 'food-district',
    'park-01': 'park-01',
    'park-02': 'park',
  }
  for (const [level, place] of Object.entries(places)) {
    await page.goto(`/level/${level}`)
    await page.getByRole('progressbar', { name: 'Tiến trình màn chơi' }).click()
    await expect.poll(async () => (await status(page)).track).toBe(`ambience-${place}`)
    await expect.poll(async () => (await status(page)).musicPlaying).toBe(true)
  }
  await page.goto('/lobby')
  await button(page, 'Cài đặt').click()
  await expect.poll(async () => (await status(page)).track).toBe('town')
})
