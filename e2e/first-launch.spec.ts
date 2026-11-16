import { expect, test, type Page } from '@playwright/test'

/** Set SHOTS=1 to save a screenshot of each screen into e2e/.results/shots. */
async function shot(page: Page, name: string) {
  if (process.env.SHOTS)
    await page.screenshot({ path: `e2e/.results/shots/${name}.png`, animations: 'disabled' })
}

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name })

/** A save with a character and nothing played. */
function seedProfile(page: Page) {
  const save = { state: { profile: { name: 'Minh' }, introSeen: true }, version: 2 }
  return page.addInitScript((value) => {
    if (!localStorage.getItem('lifesaver-save')) localStorage.setItem('lifesaver-save', value)
  }, JSON.stringify(save))
}

test('a new player can create a character, clear the first level and keep their progress', async ({
  page,
}) => {
  // First launch: loading screen, town intro, character creation.
  await page.goto('/')
  await expect(page.getByText('Đang tải…')).toBeVisible()
  await shot(page, '01-loading')
  await expect(button(page, 'Tiếp tục')).toBeVisible()
  await shot(page, '02-intro')
  // Nothing can be skipped: the intro is read slide by slide.
  await expect(button(page, 'Bỏ qua')).toHaveCount(0)
  await button(page, 'Tiếp tục').click()
  await button(page, 'Tiếp tục').click()
  await button(page, 'Bắt đầu').click()
  await page.getByLabel('Tên nhân vật').fill('Minh')
  await shot(page, '03-character')
  await button(page, 'Vào thị trấn').click()

  // Home is the town map; it points at the first level, and later areas are locked.
  await expect(button(page, 'Chơi: Tiết bốn oi ả')).toBeVisible()
  await expect(button(page, 'Trường học, đã qua 0 trên 3 màn')).toBeVisible()
  await expect(button(page, 'Công viên, đang khoá')).toBeVisible()
  await shot(page, '04-home')
  await button(page, 'Chơi: Tiết bốn oi ả').click()

  // Intro. The clock is not shown while it is not running.
  await expect(page.getByRole('timer')).toHaveCount(0)
  for (let i = 0; i < 3; i++) await button(page, 'Tiếp tục').click()
  await shot(page, '05-level-intro')
  await button(page, 'Quan sát hiện trường').click()

  // Observe: the phase only ends once enough clues are seen.
  await expect(button(page, 'Còn 3 điểm quan trọng chưa xem')).toBeDisabled()
  // An optional clue does not count towards moving on, however many are opened.
  await button(page, 'Phòng học').click()
  await expect(button(page, 'Còn 3 điểm quan trọng chưa xem')).toBeDisabled()
  for (const clue of ['Gương mặt', 'Lồng ngực', 'Tay chân']) {
    await button(page, clue).click()
  }
  await shot(page, '06-observe')
  await button(page, 'Mình đã rõ rồi').click()

  // Assess: the clock appears now that it runs. One wrong answer, then the right one.
  await expect(page.getByRole('timer')).toHaveText('1:00')
  await button(page, 'Nam bị hóc dị vật').click()
  await expect(page.getByRole('status')).toContainText('vẫn thở đều')
  await shot(page, '07-assess')
  await button(page, 'Nghi ngờ Nam bị ngất xỉu').click()
  // Each round has its own clock, which starts afresh.
  await expect(page.getByRole('timer')).toHaveText('2:00')

  // Choose: an unsafe option is blocked, then the right steps in order.
  await button(page, 'Đổ nước đường').click()
  await expect(page.getByRole('status')).toContainText('Không an toàn')
  for (const step of ['Nhìn quanh', 'Gọi tên', 'Nhờ bạn báo thầy cô']) {
    await button(page, new RegExp(step)).click()
  }
  // Picks are final: there is no undo and no confirm button.
  await expect(page.getByText('Đã chọn 3/4 việc')).toBeVisible()
  await expect(button(page, 'Thực hiện')).toHaveCount(0)
  await expect(button(page, 'Bỏ bước cuối')).toHaveCount(0)
  await shot(page, '08-choose')
  // The last right step completes the plan and the action starts by itself, with a fresh clock.
  await button(page, /kê chân cao/).click()
  await expect(page.getByRole('timer')).toHaveText('1:30')

  // Act: the hint is available and the mini-game completes.
  await button(page, 'Gợi ý').click()
  await expect(page.getByRole('dialog')).toContainText('ba lô')
  await shot(page, '09-hint')
  await button(page, 'Đã hiểu').click()
  await button(page, 'Tạm dừng').click()
  await expect(button(page, 'Thoát màn')).toBeVisible()
  await shot(page, '09b-pause')
  await button(page, 'Chơi tiếp').click()
  // One of the numbered things must not be done; tapping it is refused and explained.
  await button(page, 'Xốc Nam ngồi dậy').tap()
  await expect(page.getByRole('status')).toContainText('Không xốc dậy')
  await shot(page, '09c-decoy')
  for (const target of ['Kê ba lô dưới chân', 'Nới lỏng cổ áo', 'Mở cửa sổ']) {
    await button(page, target).tap()
  }
  await shot(page, '10-outcome')
  await button(page, 'Xem kết quả').click()

  // Result: passed, with the first-clear reward. 10 + 25 + 7 + 30 + time.
  await expect(page.getByText('+50 kinh nghiệm')).toBeVisible()
  await expect(page.getByText('Khi nào cần gọi trợ giúp')).toBeVisible()
  await expect(page.getByRole('timer')).toHaveCount(0)
  await page.waitForTimeout(1800) // let the score and stars finish animating
  await shot(page, '11-result')

  // The lesson is in the library.
  await button(page, 'Bài học').click()
  await expect(page.getByRole('heading', { name: 'Ngất xỉu' })).toBeVisible()
  await shot(page, '12-lesson')

  // Progress survives a reload.
  await page.goto('/')
  await expect(page.getByText('Minh', { exact: true })).toBeVisible()
  await expect(button(page, 'Chơi: Giờ tự học ở thư viện')).toBeVisible()
  await shot(page, '13-home')
  await button(page, 'Trường học, đã qua 1 trên 3 màn').click()
  await expect(page.getByText('Đang khoá · chạm để mở')).toHaveCount(1)
  await shot(page, '14-area')
})

test('locked areas and levels can be opened by hand', async ({ page }) => {
  await seedProfile(page)
  await page.goto('/lobby')

  // A locked area: the dialog explains the rule and offers to open it.
  await button(page, 'Công viên, đang khoá').click()
  await expect(page.getByRole('dialog')).toContainText('Phố ẩm thực')
  await shot(page, '20-unlock-area')
  await button(page, 'Để sau').click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await button(page, 'Công viên, đang khoá').click()
  await button(page, 'Mở khoá ngay').click()
  await expect(page.getByRole('heading', { name: 'Công viên' })).toBeVisible()

  // Inside, only the first level is open; a locked one opens the same way.
  await expect(page.getByText('Đang khoá · chạm để mở')).toHaveCount(2)
  await button(page, /Buổi dã ngoại cuối tuần/).click()
  await shot(page, '21-unlock-level')
  await button(page, 'Mở khoá ngay').click()
  await expect(page.getByText('Đang khoá · chạm để mở')).toHaveCount(1)
  await button(page, /Buổi dã ngoại cuối tuần/).click()
  await expect(page).toHaveURL(/\/level\/park-03$/)

  // The choice is saved: after a reload the area is still open.
  await page.goto('/lobby')
  await expect(button(page, 'Công viên, đã qua 0 trên 3 màn')).toBeVisible()
  await expect(page.getByRole('button', { name: /đang khoá/ })).toHaveCount(3)
  await shot(page, '22-home-park-open')
})

test('a level cannot be opened without a character', async ({ page }) => {
  await page.goto('/level/school-01')
  await expect(button(page, 'Tiếp tục')).toBeVisible()
  await expect(page).toHaveURL(/\/intro$/)
})
