
import { test, expect } from '@playwright/test';

test('tenant onboarding and dashboard access', async ({ page }) => {
    // 1. Start from Register page
    await page.goto('/register');

    // --- Step 1: Organization ---
    const uniqueId = Date.now().toString();
    await page.getByLabel('Organization Name').fill(`Test Org ${uniqueId}`);
    await page.getByLabel('Subdomain').fill(`test-${uniqueId}`);
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // --- Step 2: Admin Account ---
    await page.getByLabel('Full Name').fill('Test Admin');
    await page.getByLabel('Email').fill(`admin-${uniqueId}@example.com`);
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // --- Step 3: Plan Selection ---
    // Select Free Plan (assuming it's the default or selectable)
    // We look for a heading or text "Free" and click the parent card or a select button
    const freePlan = page.getByText('Free', { exact: true }).first();
    await freePlan.click();
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    // --- Step 4: Success & Navigation ---
    // Wait for submission (API call)
    await expect(page.getByText('Welcome to Smart LMS!')).toBeVisible({ timeout: 15000 });

    // Click logical button to go to dashboard
    await page.getByRole('button', { name: /Go to Dashboard/i }).click();

    // --- Verify Dashboard ---
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

    // --- Verify Sidebar Navigation ---
    // Click "Courses" link in sidebar
    await page.getByRole('link', { name: /Courses/i }).click();
    await expect(page).toHaveURL(/.*courses/);

    // Verify course page loads
    await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();
});
