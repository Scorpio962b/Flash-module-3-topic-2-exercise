import { test, expect } from '@playwright/test';

const ACCOUNT_API = '**/api/accounts/A-MOCK';

test('Mock the account', async ({ page }) => {

  await page.route(ACCOUNT_API, async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        accountId: 'A-MOCK',
        balance: 'R500.00',
      },
    });
  });

  await page.goto('/electricity?account=A-MOCK');

  await expect(
    page.getByText('R500.00')
  ).toBeVisible();
});