import { expect, test, type Page } from '@playwright/test'

/** Set SHOTS=1 to save a screenshot of each screen into e2e/.results/shots. */
async function shot(page: Page, name: string) {
  if (process.env.SHOTS) await page.screenshot({ path: `e2e/.results/shots/${name}.png` })
}

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name })

test('a new player can create a character, clear the first level and keep their progress', async ({
  page,
}) => {
  // First launch: loading screen, town intro, character creation.
  await page.goto('/')
  await expect(page.getByText('Đang tải…')).toBeVisible()
  await shot(page, '01-loading')
  await expect(button(page, 'Tiếp tục')).toBeVisible()
  await shot(page, '02-intro')
  await button(page, 'Bỏ qua').click()
  await page.getByLabel('Tên nhân vật').fill('Minh')
  await shot(page, '03-character')
  await button(page, 'Vào thị trấn').click()

  // Lobby points at the first level.
  await expect(page.getByText('Tiếp theo: Tiết bốn oi ả')).toBeVisible()
  await shot(page, '04-lobby')
  await button(page, 'Chơi').click()

  // Intro.
  for (let i = 0; i < 3; i++) await button(page, 'Tiếp tục').click()
  await shot(page, '05-level-intro')
  await button(page, 'Quan sát hiện trường').click()

  // Observe: the phase only ends once enough clues are seen.
  await expect(button(page, /Đã xem 0\/3/)).toBeDisabled()
  for (const clue of ['Gương mặt', 'Lồng ngực', 'Tay chân']) {
    await button(page, clue).click()
    // The view zooms in on the clue; tapping the scene zooms back out.
    await page.locator('[data-zoomed]').click({ position: { x: 8, y: 8 } })
    await expect(page.locator('[data-zoomed]')).toHaveCount(0)
  }
  await shot(page, '06-observe')
  await button(page, 'Mình đã rõ rồi').click()

  // Assess: one wrong answer, then the right one.
  await button(page, 'Nam bị hóc dị vật').click()
  await expect(page.getByRole('status')).toContainText('vẫn thở đều')
  await shot(page, '07-assess')
  await button(page, 'Nghi ngờ Nam bị ngất xỉu').click()

  // Choose: an unsafe option is blocked, then the right steps in order.
  await button(page, 'Đổ nước đường').click()
  await expect(page.getByRole('status')).toContainText('Không an toàn')
  for (const step of ['Nhìn quanh', 'Gọi tên', 'Nhờ bạn báo thầy cô', 'kê chân cao']) {
    await button(page, new RegExp(step)).click()
  }
  await shot(page, '08-choose')
  await button(page, 'Thực hiện').click()

  // Act: the hint is available and the mini-game completes.
  await button(page, 'Gợi ý').click()
  await expect(page.getByRole('dialog')).toContainText('ba lô')
  await shot(page, '09-hint')
  await button(page, 'Đã hiểu').click()
  for (const target of ['Kê ba lô dưới chân', 'Nới lỏng cổ áo', 'Mở cửa sổ']) {
    await button(page, target).tap()
  }
  await shot(page, '10-outcome')
  await button(page, 'Xem kết quả').click()

  // Result: passed, with the first-clear reward. 10 + 25 + 7 + 30 + time.
  await expect(page.getByText('+50 kinh nghiệm')).toBeVisible()
  await expect(page.getByText('Khi nào cần gọi trợ giúp')).toBeVisible()
  await shot(page, '11-result')

  // The lesson is in the library.
  await button(page, 'Bài học').click()
  await expect(page.getByRole('heading', { name: 'Ngất xỉu' })).toBeVisible()
  await shot(page, '12-lesson')

  // Progress survives a reload.
  await page.goto('/')
  await expect(page.getByText('Minh')).toBeVisible()
  await button(page, /Bản đồ/).click()
  await expect(page.getByText('1/3')).toBeVisible()
  await shot(page, '13-map')
  await button(page, /^1\. Trường học/).click()
  await expect(page.getByText('Hoàn thành màn trước để mở khoá').first()).toBeVisible()
  await shot(page, '14-area')
})

test('a level cannot be opened without a character', async ({ page }) => {
  await page.goto('/level/school-01')
  await expect(button(page, 'Tiếp tục')).toBeVisible()
  await expect(page).toHaveURL(/\/intro$/)
})
