import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['./reporters/summaryReporter.ts', { outputDir: 'custom-report' }],
  ],
  use: {
    baseURL: 'https://astroflow.wingflows.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Uncomment for local visual debugging (adds 1s pause between actions):
    // headless: false,
    // launchOptions: {
    //   slowMo: 1000,
    // },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
