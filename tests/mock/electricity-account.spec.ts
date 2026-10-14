import { test, expect } from '@playwright/test';

// Define a test to mock an account balance directly using Playwright's route interception
test('Mock the account balance', async ({ page }) => {
  // Intercept requests matching the mock account endpoint and return a custom predefined JSON response
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } })
  );
  
  // Navigate to the electricity page using the mock account ID query parameter
  await page.goto('/electricity?account=A-MOCK');
  
  // Verify that the mocked balance appears correctly and is visible on the UI
  await expect(page.getByText('R500.00')).toBeVisible();
});