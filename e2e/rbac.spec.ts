
import { test, expect } from '@playwright/test';

test.describe('Role Based Access Control', () => {
    test('Student should not access Instructor or Admin areas', async ({ page }) => {
        // Since we can't easily seed, we might need to register.
        // But let's try to see if demo accounts work.
        await page.goto('/login');
        await page.getByLabel('Email').fill('student@demo.com');
        await page.getByLabel('Password').fill('Password123!');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        // Wait for dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Try to access /instructor
        await page.goto('/instructor');
        await expect(page).toHaveURL(/.*dashboard/); // Should be redirected back

        // Try to access /admin
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*dashboard/); // Should be redirected back
    });

    test('Instructor should access Instructor areas but not Admin', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('instructor@demo.com');
        await page.getByLabel('Password').fill('Password123!');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        // Wait for dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Try to access /instructor
        await page.goto('/instructor');
        await expect(page).toHaveURL(/.*instructor/);

        // Try to access /admin
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*dashboard/); // Should be redirected back
    });

    test('Admin should access everything', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@demo.com');
        await page.getByLabel('Password').fill('Password123!');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        // Wait for dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Try to access /instructor
        await page.goto('/instructor');
        await expect(page).toHaveURL(/.*instructor/);

        // Try to access /admin
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*admin/);
    });
});
