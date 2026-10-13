import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

test('Show an error when the connection drops', async ({ page }) => {
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  await page.route('**/api/accounts/A-MOCK/electricity', route => route.abort('failed'));

  await page.goto('/electricity?account=A-MOCK');
  await sendMoney(page, '12345678901', '50');
  await expect(page.getByTestId('purchase-result')).toContainText(/error|failed|connection|try again/i);
});
