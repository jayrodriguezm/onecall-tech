import { defineConfig, devices } from '@playwright/test';
import { getBaseUrl } from './config/env';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
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
    baseURL: getBaseUrl(),
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
