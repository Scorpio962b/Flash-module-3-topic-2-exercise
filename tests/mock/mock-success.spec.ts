import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

// Define a test to verify that a successful electricity purchase correctly displays the returned token and updated balance
test('Show the mocked purchase token and balance', async ({ page }) => {
  // Mock the account details API request to return an initial account balance
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  
  // Mock the electricity transaction API request to return a successful 201 status along with the token and new balance
  await page.route('**/api/accounts/A-MOCK/electricity', route =>
    route.fulfill({
      status: 201,
      json: {
        result: 'success', message: 'Electricity purchased successfully',
        token: '1234-5678-9012-3456-7890', balance: 'R450.00',
      },
    })
  );

  // Navigate to the electricity page using the mock account ID
  await page.goto('/electricity?account=A-MOCK');
  
  // Perform the money-sending action to buy electricity in the UI
  await sendMoney(page, '12345678901', '50');
  
  // Verify that the success message is correctly displayed in the purchase result container
  await expect(page.getByTestId('purchase-result')).toContainText('Electricity purchased successfully');
  
  // Verify that the generated purchase token is displayed correctly
  await expect(page.getByTestId('purchase-token')).toContainText('1234-5678-9012-3456-7890');
  
  // Assert that the account balance updates to reflect the deducted amount (R450.00)
  await expect(page.getByTestId('account-balance')).toHaveText('R450.00');
});