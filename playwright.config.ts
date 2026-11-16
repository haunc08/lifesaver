import { defineConfig } from '@playwright/test'

const PORT = 5183

/**
 * End-to-end tests run at a phone-sized viewport, in the installed Chrome
 * (`pnpm test:e2e`) and in WebKit, the engine behind Safari (`pnpm test:e2e:safari`,
 * after `pnpm exec playwright install webkit`).
 */
export default defineConfig({
  testDir: 'e2e',
  // The pictures for the demo sheet are taken only on request (`pnpm demo:sheet`).
  testIgnore: process.env.DEMO ? [] : ['**/demo-shots.spec.ts'],
  outputDir: 'e2e/.results',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    locale: 'vi-VN',
  },
  projects: [
    { name: 'chrome', use: { channel: 'chrome' } },
    { name: 'safari', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
  },
})
