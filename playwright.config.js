// End-to-end tests. Run: npm run test:e2e
// Locally this uses your installed Google Chrome; in CI it uses Playwright's bundled Chromium.
const { defineConfig } = require('@playwright/test');

const CI = !!process.env.CI;

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  workers: 2, // python http.server has a small connection backlog
  retries: CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8123',
    channel: CI ? undefined : 'chrome',
    serviceWorkers: 'block'
  },
  webServer: {
    command: `${CI ? 'python3' : 'python'} -m http.server 8123 --bind 127.0.0.1`,
    url: 'http://127.0.0.1:8123/index.html',
    reuseExistingServer: !CI
  }
});
