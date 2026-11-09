// End-to-end tests. Run: npm run test:e2e  (uses the locally installed Google Chrome)
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  workers: 2, // python http.server has a small connection backlog
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8123',
    channel: 'chrome',
    serviceWorkers: 'block'
  },
  webServer: {
    command: 'python -m http.server 8123 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8123/index.html',
    reuseExistingServer: true
  }
});
