import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

// Define a Playwright test to verify the network request sent by the UI
test('Check the request sent by the UI', async ({ page, request }) => {
  // Create a new account via the API and retrieve its unique ID
  const id = await createAccount(request);
  
  // Navigate to the electricity page, passing the account ID as a query parameter
  await page.goto(`/electricity?account=${id}`);

  // Set up a listener promise to wait for a specific outgoing POST request to the electricity API endpoint
  const requestPromise = page.waitForRequest(
    r => r.url().endsWith(`/api/accounts/${id}/electricity`) && r.method() === 'POST'
  );
  
  // Trigger the UI actions to buy electricity with the specified meter number and amount
  await sendMoney(page, '12345678901', '50.00');

  // Await the captured request and assert that the sent JSON payload matches the expected data
  expect((await requestPromise).postDataJSON()).toEqual({
    meterNumber: '12345678901',
    amount: '50.00',
  });
});