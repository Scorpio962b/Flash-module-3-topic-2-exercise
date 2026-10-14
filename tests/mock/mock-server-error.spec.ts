import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

// Define a test to verify that the UI displays a friendly user message and maintains proper state during a server error
test('Show a friendly message for a server error', async ({ page }) => {
  // Mock the account details API request to return a successful account balance
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  
  // Mock the electricity transaction API request to simulate an internal server error (status 500)
  await page.route('**/api/accounts/A-MOCK/electricity', route =>
    route.fulfill({ status: 500, json: { message: 'Internal error' } })
  );

  // Navigate to the electricity page using the mock account ID
  await page.goto('/electricity?account=A-MOCK');
  
  // Attempt to buy electricity by sending the money request via the UI
  await sendMoney(page, '12345678901', '50');
  
  // Verify that a friendly retry message is shown in the purchase result section
  await expect(page.getByTestId('purchase-result')).toContainText('Please try again');
  
  // Assert that the account balance remains unchanged after the failed transaction
  await expect(page.getByTestId('account-balance')).toHaveText('R500.00');
  
  // Verify that no purchase token was generated or displayed due to the server error
  await expect(page.getByTestId('purchase-token')).toBeEmpty();
});