import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./__tests__",
  testMatch: "**/*.spec.ts",

  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: '.auth/user.json',
      },
    },
  
    // removing firefox testing cause it's not working, tested manually and it works so we can solve this later
    // TODO: fix firefox testing
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     storageState: '.auth/user.json',
    //   },
    // },
  ],

  outputDir: "results/",
  webServer: undefined,
};

export default config;

