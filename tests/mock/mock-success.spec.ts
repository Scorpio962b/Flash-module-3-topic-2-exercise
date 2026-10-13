import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

test('Show the mocked purchase token and balance', async ({ page }) => {
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  await page.route('**/api/accounts/A-MOCK/electricity', route =>
    route.fulfill({
      status: 201,
      json: {
        result: 'success', message: 'Electricity purchased successfully',
        token: '1234-5678-9012-3456-7890', balance: 'R450.00',
      },
    })
  );

  await page.goto('/electricity?account=A-MOCK');
  await sendMoney(page, '12345678901', '50');
  await expect(page.getByTestId('purchase-result')).toContainText('Electricity purchased successfully');
  await expect(page.getByTestId('purchase-token')).toContainText('1234-5678-9012-3456-7890');
  await expect(page.getByTestId('account-balance')).toHaveText('R450.00');
});
