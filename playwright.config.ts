import { defineConfig } from '@playwright/test'

const PORT = 5183

/** End-to-end tests run in the installed Chrome at a phone-sized viewport. */
export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e/.results',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    locale: 'vi-VN',
  },
  webServer: {
    command: `pnpm dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
  },
})
