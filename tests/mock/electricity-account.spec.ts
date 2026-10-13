import { test, expect } from '@playwright/test';

test('Mock the account balance', async ({ page }) => {
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  await page.goto('/electricity?account=A-MOCK');
  await expect(page.getByText('R500.00')).toBeVisible();
});
