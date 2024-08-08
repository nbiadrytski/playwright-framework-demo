import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'],
    ['html'],
    [
      'allure-playwright',
      {
        detail: false,
        outputFolder: './allure-results',
        suiteTitle: false,
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 0,
    baseURL: 'https://playwright.dev',
    trace: 'retain-on-failure',
    headless: false,
    video: 'on',
    screenshot: 'on',
  },

  projects: [
    {
      name: 'api-tests',
      use: { },
      testDir: './api/tests',
    },
    {
      name: 'ui-tests',
      use: { ...devices['Desktop Chrome'] },
      testDir: './web/tests',
    },
  ],
});
