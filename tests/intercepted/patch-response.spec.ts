import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

// Define a test to verify that network responses can be intercepted and mocked to patch the UI display
test('Patch the account balance shown in the UI', async ({ page, request }) => {
  // Create a new account via the API and store its unique ID
  const id = await createAccount(request);
  
  // Intercept network requests to the account details endpoint
  await page.route(`**/api/accounts/${id}`, async route => {
    // Fetch the original response from the server
    const response = await route.fetch();
    // Fulfill the route by modifying the JSON payload to mock a custom balance ('R999.00')
    await route.fulfill({ response, json: { ...(await response.json()), balance: 'R999.00' } });
  });

  // Navigate to the electricity page for the account
  await page.goto(`/electricity?account=${id}`);
  
  // Assert that the mocked balance text is successfully rendered and visible on the UI
  await expect(page.getByText('R999.00')).toBeVisible();
});