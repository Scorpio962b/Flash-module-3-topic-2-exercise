// Import test to run the test and expect to check if the results are correct.
import { test, expect } from '@playwright/test';

// Import the helper function that creates an electricity account.
import { createAccount } from '../support/electricity-api';

// Import the helper function that fills in and submits the electricity purchase form.
import { sendMoney } from '../support/buy-electricity';

// Define a test to check that a successful electricity purchase is recorded.
test('A purchase is recorded', async ({ page, request }) => {

  // Create a new account using the API and save its ID.
  const id = await createAccount(request);

  // Open the electricity purchase page for the account that was created.
  await page.goto(`/electricity?account=${id}`);

  // Wait for the POST request that submits the electricity purchase.
  // This matches the URL for the account and checks that the request method is POST.
  const responsePromise = page.waitForResponse(
    r => r.url().includes(`/api/accounts/${id}/electricity`) && r.request().method() === 'POST'
  );

  // Use the helper function to enter the meter number and purchase amount,
  // then submit the electricity purchase.
  await sendMoney(page, '12345678901', '50');

  // Wait for the API response from the purchase request.
  const response = await responsePromise;

  // Check that the API returns status code 201, meaning the purchase was created successfully.
  expect(response.status()).toBe(201);

  // Read the response JSON and extract the electricity token.
  const { token } = await response.json();

  // Check that the token contains five groups of four digits separated by hyphens.
  expect(token).toMatch(/^\d{4}(-\d{4}){4}$/);

  // Check that the page displays a message confirming the electricity purchase.
  // The regular expression ignores uppercase and lowercase differences.
  await expect(page.getByTestId('purchase-result')).toContainText(/electricity purchased/i);

  // Check that the electricity token displayed on the page matches the API token.
  await expect(page.getByTestId('purchase-token')).toContainText(token);

  // Check that the balance displayed on the page is R450.00 after spending R50.
  await expect(page.getByTestId('account-balance')).toHaveText('R450.00');

  // Send a GET request to retrieve the account details.
  // Check that the balance saved by the backend is R450.00.
  expect((await (await request.get(`/api/accounts/${id}`)).json()).balance).toBe('R450.00');

  // Send a GET request to retrieve the account's purchase history.
  // Check that the purchase was saved with the correct token, meter number and amount.
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([
    { token, meterNumber: '12345678901', amount: 'R50.00' },
  ]);
});