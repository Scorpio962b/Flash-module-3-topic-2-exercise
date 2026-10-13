
import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

const ACCOUNT_API = '**/api/accounts/A-MOCK';
const ELECTRICITY_API = '**/api/accounts/A-MOCK/electricity';

test('10. Mock success with token and new balance', async ({ page }) => {
  await page.route(ACCOUNT_API, async route => {
    await route.fulfill({
      status: 200,
      json: {
        accountId: 'A-MOCK',
        balance: 'R500.00',
      },
    });
  });

  await page.route(ELECTRICITY_API, async route => {
    await route.fulfill({
      status: 201,
      json: {
        result: 'success',
        message: 'Electricity purchased successfully',
        token: '1234-5678-9012-3456-7890',
        balance: 'R450.00',
      },
    });
  });

  await page.goto('/electricity?account=A-MOCK');

  await sendMoney(page, '12345678901', '50');

  const result = page.getByTestId('purchase-result');

  await expect(result).toBeVisible();
  await expect(result).toContainText('Electricity purchased successfully');

  await expect(page.getByTestId('purchase-token'))
    .toContainText('1234-5678-9012-3456-7890');

  await expect(page.getByTestId('account-balance'))
    .toHaveText('R450.00');
});
