import { expect, test, type Page } from '@playwright/test'
import { button, openLevel, shot } from './helpers'

/** The layout must hold on the smallest phones still in common use. */

const SIZES = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
]

async function expectNoSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
}

/** The element is fully inside the screen, so it can be tapped without scrolling. */
async function expectOnScreen(page: Page, name: string) {
  const box = await button(page, name).boundingBox()
  const size = page.viewportSize()!
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(size.width)
  expect(box!.y + box!.height).toBeLessThanOrEqual(size.height)
}

for (const size of SIZES) {
  const tag = `${size.width}x${size.height}`

  test(`home and a level fit a ${tag} screen`, async ({ page }) => {
    await page.setViewportSize(size)
    const level = await openLevel(page, 'school-01')

    // Level intro and observe: the main button stays on screen.
    await expectNoSidewaysScroll(page)
    await expectOnScreen(page, 'Tiếp tục')
    await shot(page, `small-${tag}-intro`)
    for (let i = 1; i < level.intro.length; i++) await button(page, 'Tiếp tục').click()
    await button(page, 'Quan sát hiện trường').click()
    await expectOnScreen(page, `Đã xem 0/${level.observe.required} manh mối`)
    for (const clue of level.observe.clues.slice(0, level.observe.required)) {
      await button(page, clue.label).click()
      await page.locator('[data-zoomed]').click({ position: { x: 8, y: 8 } })
    }
    await button(page, 'Mình đã rõ rồi').click()

    // Assess and choose: long option lists may scroll, but never sideways.
    await shot(page, `small-${tag}-assess`)
    await expectNoSidewaysScroll(page)
    await button(page, level.assess.options.find((o) => o.correct)!.text).click()
    await shot(page, `small-${tag}-choose`)
    await expectNoSidewaysScroll(page)
    for (const stepId of level.choose.order) {
      await button(page, level.choose.options.find((o) => o.id === stepId)!.text).click()
    }
    await button(page, 'Thực hiện').scrollIntoViewIfNeeded()
    await button(page, 'Thực hiện').click()
    await shot(page, `small-${tag}-act`)
    await expectNoSidewaysScroll(page)

    // Home: every area marker and the play button are on screen.
    await page.goto('/lobby')
    await expect(page.getByRole('group', { name: 'Bản đồ thị trấn' })).toBeVisible()
    await expectNoSidewaysScroll(page)
    await expectOnScreen(page, 'Thư viện')
    for (const area of ['Trường học', 'Ký túc xá', 'Đường phố', 'Phố ẩm thực', 'Công viên']) {
      await expectOnScreen(
        page,
        `${area}, đã qua ${area === 'Đường phố' || area === 'Ký túc xá' || area === 'Phố ẩm thực' ? 2 : 3} trên ${area === 'Đường phố' || area === 'Ký túc xá' || area === 'Phố ẩm thực' ? 2 : 3} màn`,
      )
    }
    await shot(page, `small-${tag}-home`)
  })
}
