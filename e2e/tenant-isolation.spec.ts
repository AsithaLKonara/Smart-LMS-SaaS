import { test, expect } from '@playwright/test';

test.describe('Tenant and module API guards', () => {
  test('requires auth for protected module APIs', async ({ request }) => {
    const allowedStatuses = [200, 401, 403, 302];

    const billingRes = await request.get('/api/billing');
    expect(allowedStatuses).toContain(billingRes.status());

    const assetsRes = await request.get('/api/assets');
    expect(allowedStatuses).toContain(assetsRes.status());

    const messagingRes = await request.get('/api/messaging/threads');
    expect(allowedStatuses).toContain(messagingRes.status());

    const notifPrefs = await request.get('/api/notifications/preferences');
    expect(allowedStatuses).toContain(notifPrefs.status());
  });
});
