import { test, expect } from '@playwright/test';

const ACCOUNT_API = '**/api/accounts/A-MOCK';

test('13. Mock account API down with 503', async ({ page }) => {

  await page.route(ACCOUNT_API, async (route) => {
    await route.fulfill({
      status: 503,
      json: {
        result: 'error',
        message: 'Account service unavailable',
      },
    });
  });

  await page.goto('/electricity?account=A-MOCK');

  await expect(
    page.getByText('Unavailable', { exact: true })
  ).toBeVisible();
});