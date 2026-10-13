import { test, expect } from '@playwright/test';

test('Show unavailable when the account API is down', async ({ page }) => {
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ status: 503, json: { result: 'error', message: 'Account service unavailable' } })
  );
  await page.goto('/electricity?account=A-MOCK');
  await expect(page.getByText('Unavailable', { exact: true })).toBeVisible();
});
