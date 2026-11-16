import { expect, test, type Page } from '@playwright/test'
import { arrangePlan, button, openLevel, playMinigame, playToAct, shot } from './helpers'

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
    const essential = level.observe.clues.filter((c) => c.essential)
    await expectOnScreen(page, `Còn ${essential.length} điểm quan trọng chưa xem`)
    for (const clue of essential) await button(page, clue.label).click()
    await button(page, 'Mình đã rõ rồi').click()

    // Assess and choose: long option lists may scroll, but never sideways.
    await shot(page, `small-${tag}-assess`)
    await expectNoSidewaysScroll(page)
    await button(page, level.assess.options.find((o) => o.correct)!.text).click()
    await shot(page, `small-${tag}-choose`)
    await expectNoSidewaysScroll(page)
    for (const o of level.choose.options.filter((x) => x.kind === 'correct')) {
      await button(page, o.text).click()
    }
    // Ordering: the list and its button fit without sideways scrolling.
    await shot(page, `small-${tag}-order`)
    await expectNoSidewaysScroll(page)
    await arrangePlan(page, level.choose.order)
    await button(page, 'Thực hiện').click()
    await shot(page, `small-${tag}-review`)
    await expectNoSidewaysScroll(page)
    await button(page, 'Tiếp tục').click()
    await shot(page, `small-${tag}-act`)
    await expectNoSidewaysScroll(page)
    // Scrolled to the end, the last control keeps clear of the bottom edge.
    await page.locator('main').evaluate((el) => el.scrollTo(0, el.scrollHeight))
    const last = await page.locator('main button').last().boundingBox()
    expect(size.height - (last!.y + last!.height)).toBeGreaterThanOrEqual(20)

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

// The gesture mini-games and the phone call, on the smallest screen: two levels that
// between them use every new mechanic.
for (const id of ['dormitory-02', 'park-02']) {
  test(`the mini-games of ${id} can be played on a 320x568 screen`, async ({ page }) => {
    await page.setViewportSize(SIZES[0])
    const level = await openLevel(page, id)
    const steps = level.act.type === 'sequence' ? level.act.steps : [level.act]
    await playToAct(page, level)
    for (const [i, step] of steps.entries()) {
      await expect(page.getByText(`Bước ${i + 1}/${steps.length}`)).toBeVisible()
      await expectNoSidewaysScroll(page)
      await shot(page, `small-${id}-${step.type}`)
      await playMinigame(page, step)
    }
    await button(page, 'Xem kết quả').click()
    await expect(page.getByRole('heading', { name: 'Tuyệt vời!' })).toBeVisible()
  })
}
