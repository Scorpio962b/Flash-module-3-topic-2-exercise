// Import test to run the test and expect to check if the results are correct.
import { test, expect } from '@playwright/test';

// Import the helper function that creates an electricity account.
import { createAccount } from '../support/electricity-api';

// Import the helper function that fills in and submits the electricity purchase form.
import { sendMoney } from '../support/buy-electricity';

// Define a test to check that a refused purchase is not saved and does not change the balance.
test('A refused purchase leaves no trace', async ({ page, request }) => {

  // Create a new electricity account using the API and save its ID.
  const id = await createAccount(request);

  // Open the electricity purchase page for the newly created account.
  await page.goto(`/electricity?account=${id}`);

  // Attempt to purchase R501 worth of electricity.
  // The account has only R500.00, so the purchase should be refused.
  await sendMoney(page, '12345678901', '501');

  // Check that the page displays the expected error message because there are not enough funds.
  await expect(page.getByTestId('purchase-result')).toContainText('Not enough funds in your Flash wallet');

  // Send a GET request to retrieve the account details.
  // Check that the balance is still R500.00 because the purchase was refused.
  expect((await (await request.get(`/api/accounts/${id}`)).json()).balance).toBe('R500.00');

  // Send a GET request to retrieve the account's purchase history.
  // Check that the list is empty because the refused purchase was not recorded.
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([]);
});