
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: {
        command: 'npm run build && next start -H 127.0.0.1 -p 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 240000,
        env: {
            NEXTAUTH_SECRET: 'supersecret',
        },
    },
});
