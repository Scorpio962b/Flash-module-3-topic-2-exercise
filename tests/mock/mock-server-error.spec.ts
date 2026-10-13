import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

const ACCOUNT_API = '**/api/accounts/A-MOCK';
const ELECTRICITY_API = '**/api/accounts/A-MOCK/electricity';

test('11. Mock server error 500', async ({ page }) => {

  await page.route(ACCOUNT_API, async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        accountId: 'A-MOCK',
        balance: 'R500.00',
      },
    });
  });

  await page.route(ELECTRICITY_API, async (route) => {
    await route.fulfill({
      status: 500,
      json: {
        result: 'error',
        message: 'Something went wrong. Please try again later.',
        balance: 'R500.00',
      },
    });
  });

  await page.goto('/electricity?account=A-MOCK');

  await sendMoney(
    page,
    '12345678901',
    '50.00'
  );

  const result = page.getByTestId('purchase-result');

  await expect(result).toBeVisible();

// Balance must remain unchanged
await expect(
  page.getByTestId('account-balance')
).toHaveText('R500.00');

// Balance must remain unchanged
await expect(
  page.getByTestId('account-balance')
).toHaveText('R500.00');
  // No token should be shown
  await expect(result).not.toContainText(
    '1234-5678-9012-3456-7890'
  );
});