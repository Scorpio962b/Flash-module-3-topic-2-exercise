import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

const ACCOUNT_API = '**/api/accounts/A-MOCK';
const ELECTRICITY_API = '**/api/accounts/A-MOCK/electricity';

test('12. Mock dropped connection', async ({ page }) => {

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
    await route.abort('failed');
  });

  await page.goto('/electricity?account=A-MOCK');

  await sendMoney(
    page,
    '12345678901',
    '50.00'
  );

  const result = page.getByTestId('purchase-result');

  await expect(result).toBeVisible();

  await expect(result).toContainText(
    /error|failed|connection|try again/i
  );
});