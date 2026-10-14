import { test, expect } from '@playwright/test';

// Define a test to verify how the UI handles and displays an error state when the account API is down
test('Show unavailable when the account API is down', async ({ page }) => {
  // Intercept requests to the mock account endpoint and fulfill them with a 503 Service Unavailable status and error message
  await page.route('**/api/accounts/A-MOCK', route =>
    route.fulfill({ status: 503, json: { result: 'error', message: 'Account service unavailable' } })
  );
  
  // Navigate to the electricity page using the mock account ID query parameter
  await page.goto('/electricity?account=A-MOCK');
  
  // Verify that the UI correctly displays the 'Unavailable' fallback text when the service fails
  await expect(page.getByText('Unavailable', { exact: true })).toBeVisible();
});