
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Smart LMS/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    // Find the 'Get Started' link in the main CTA, which should lead to login
    await page.getByRole('link', { name: 'Get Started' }).click();

    // Expects page url to contain "login"
    await expect(page).toHaveURL(/.*login/);

    // Verify login page element
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
});
