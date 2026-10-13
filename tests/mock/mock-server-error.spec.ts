import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

test('Show a friendly message for a server error', async ({ page }) => {
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  await page.route('**/api/accounts/A-MOCK/electricity', route =>
    route.fulfill({ status: 500, json: { message: 'Internal error' } })
  );

  await page.goto('/electricity?account=A-MOCK');
  await sendMoney(page, '12345678901', '50');
  await expect(page.getByTestId('purchase-result')).toContainText('Please try again');
  await expect(page.getByTestId('account-balance')).toHaveText('R500.00');
  await expect(page.getByTestId('purchase-token')).toBeEmpty();
});
