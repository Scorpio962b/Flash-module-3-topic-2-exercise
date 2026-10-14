import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

// Define a test to verify that the UI and API correctly handle and display a refusal response
test('Check the refusal response', async ({ page, request }) => {
  // Create a new account via the API and store its unique ID
  const id = await createAccount(request);
  
  // Navigate to the electricity page for the created account
  await page.goto(`/electricity?account=${id}`);

  // Set up a listener promise to capture the POST response from the electricity API endpoint
  const responsePromise = page.waitForResponse(
    r => r.url().endsWith(`/api/accounts/${id}/electricity`) && r.request().method() === 'POST'
  );
  
  // Attempt to send an amount (501) that triggers a refusal due to insufficient funds
  await sendMoney(page, '12345678901', '501');
  
  // Await the completion of the network response
  const response = await responsePromise;

  // Assert that the server returned a 422 Unprocessable Entity status code (refusal)
  expect(response.status()).toBe(422);
  
  // Extract the error message from the response JSON payload
  const { message } = await response.json();
  
  // Assert that the API error message matches the expected wallet balance warning
  expect(message).toBe('Not enough funds in your Flash wallet');
  
  // Verify that the UI element displays the corresponding error message to the user
  await expect(page.getByTestId('purchase-result')).toContainText(message);
});