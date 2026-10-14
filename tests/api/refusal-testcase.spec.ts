// Import test to run the test and expect to check if the results are correct.
import { test, expect } from '@playwright/test';

// Import the helper function that creates an electricity account for testing.
import { createAccount } from '../support/electricity-api';

// Define a test to check that a purchase exceeding the wallet balance by one rand is refused.
test('API: one rand over balance is refused without a purchase', async ({ request }) => {

  // Create a new account and store its ID in the id variable.
  // await waits for the account to be created before continuing.
  const id = await createAccount(request);

  // Send a POST request to attempt an electricity purchase using this account.
  const response = await request.post(`/api/accounts/${id}/electricity`, {

    // Send the meter number and purchase amount in the request body.
    // The account has R500.00, so the requested R501 is R1 over the balance.
    data: { meterNumber: '12345678901', amount: '501' },
  });

  // Check that the API returns status code 422, meaning the request was rejected.
  expect(response.status()).toBe(422);

  // Check that the API returns the expected error message and unchanged balance.
  expect(await response.json()).toEqual({
    result: 'error', // Confirms that the purchase failed.
    message: 'Not enough funds in your Flash wallet', // Explains why the purchase was refused.
    balance: 'R500.00', // Confirms that the wallet balance remains unchanged.
  });

  // Get the purchase history for the account, convert the response to JSON,
  // and check that the list is empty because no purchase was made.
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([]);
});