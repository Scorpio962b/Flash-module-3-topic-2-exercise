import { test, expect } from '@playwright/test';
import { sendMoney } from '../support/buy-electricity';

// Define a test to verify that the UI gracefully handles and displays an error when the network connection drops during a transaction
test('Show an error when the connection drops', async ({ page }) => {
  // Mock the initial account details API request to return a valid account balance
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  
  // Intercept the electricity transaction API request and abort it to simulate a dropped network connection
  await page.route('**/api/accounts/A-MOCK/electricity', route => route.abort('failed'));

  // Navigate to the electricity page using the mock account ID
  await page.goto('/electricity?account=A-MOCK');
  
  // Attempt to submit an electricity purchase
  await sendMoney(page, '12345678901', '50');
  
  // Verify that an appropriate error message indicating failure, connection issues, or a retry prompt is shown in the UI
  await expect(page.getByTestId('purchase-result')).toContainText(/error|failed|connection|try again/i);
});