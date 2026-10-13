import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('18. A refusal leaves no trace', async ({
  page,
  request,
}) => {

  const accountID = await createAccount(
    request,
    '500'
  );

  const meterNumber = '12345678901';
  const amount = '501';

  await page.goto(
    `/electricity?account=${accountID}`
  );

  await sendMoney(
    page,
    meterNumber,
    amount
  );

  // Check the error displayed on the page
  const result = page.getByTestId(
    'purchase-result'
  );

  await expect(result).toBeVisible();

  await expect(result).toContainText(
    'Not enough funds in your Flash wallet'
  );

  // Check account balance
  const accountResponse = await request.get(
    `/api/accounts/${accountID}`
  );

  expect(accountResponse.status()).toBe(200);

  const account = await accountResponse.json();

  expect(account.balance).toBe(
    'R500.00'
  );

  // Check purchase history
  const historyResponse = await request.get(
    `/api/accounts/${accountID}/purchases`
  );

  expect(historyResponse.status()).toBe(200);

  const history = await historyResponse.json();

  expect(history).toEqual([]);
});