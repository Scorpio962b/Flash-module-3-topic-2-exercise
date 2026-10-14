// Import test to run the test and expect to check the results.
import { test, expect } from '@playwright/test';

// Import the helper function that creates an electricity account.
import { createAccount } from '../support/electricity-api';

// Define a test to check that a valid electricity purchase returns status code 201.
test('API: a valid electricity purchase returns 201', async ({ request }) => {

  // Create an account and store its ID in the id variable.
  const id = await createAccount(request);

  // Send a POST request to purchase electricity for this account.
  const response = await request.post(`/api/accounts/${id}/electricity`, {

    // Send the meter number and purchase amount in the request body.
    // The customer is purchasing R50 worth of electricity.
    data: { meterNumber: '12345678901', amount: '50' },
  });

  // Check that the API returns status code 201, meaning the purchase was created successfully.
  expect(response.status()).toBe(201);

  // Check that the response contains the expected successful purchase details.
  expect(await response.json()).toMatchObject({
    result: 'success', // Confirms that the purchase was successful.

    balance: 'R450.00', // Confirms that R50 was deducted from the original R500 balance.

    // Check that the electricity token follows the required format:
    // five groups of four digits, separated by hyphens.
    // Example: 1234-5678-9012-3456-7890
    token: expect.stringMatching(/^\d{4}(-\d{4}){4}$/),
  });
});