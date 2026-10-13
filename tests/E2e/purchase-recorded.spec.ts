
import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('17. A purchase is recorded', async ({ page, request }) => {
  const accountID = await createAccount(request, '500');

  const meterNumber = '12345678901';
  const amount = '50';

  await page.goto(`/electricity?account=${accountID}`);

  const purchaseResponsePromise = page.waitForResponse(
    response =>
      response.url().includes(`/api/accounts/${accountID}/electricity`) &&
      response.request().method() === 'POST'
  );

  await sendMoney(page, meterNumber, amount);

  const purchaseResponse = await purchaseResponsePromise;
  expect(purchaseResponse.status()).toBe(201);

  const purchaseBody = await purchaseResponse.json();
  const token = purchaseBody.token;

  expect(token).toMatch(/^\d{4}(-\d{4}){4}$/);

  const result = page.getByTestId('purchase-result');

  await expect(result).toBeVisible();
  await expect(result).toContainText(/electricity purchased/i);

  await expect(page.getByTestId('purchase-token')).toContainText(token);
  await expect(page.getByTestId('account-balance')).toHaveText('R450.00');

  const accountResponse = await request.get(`/api/accounts/${accountID}`);

  expect(accountResponse.status()).toBe(200);

  const account = await accountResponse.json();
  expect(account.balance).toBe('R450.00');

  const historyResponse = await request.get(
    `/api/accounts/${accountID}/purchases`
  );

  expect(historyResponse.status()).toBe(200);

  const history = await historyResponse.json();
  expect(history).toHaveLength(1);

expect(history[0]).toMatchObject({
  token: token,
  meterNumber: meterNumber,
  amount: 'R50.00',
});
});
