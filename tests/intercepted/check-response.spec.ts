import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';
test('15. Check the refusal response', async ({
  page,
  request,
}) => {

  const accountID = await createAccount(
    request,
    '500'
  );

  const responsePromise = page.waitForResponse(
    `**/api/accounts/${accountID}/electricity`
  );

  await page.goto(
    `/electricity?account=${accountID}`
  );

  await sendMoney(
    page,
    '12345678901',
    '501'
  );

  const response = await responsePromise;

  expect(response.status()).toBe(422);

  const body = await response.json();

  expect(body.message).toBe(
    'Not enough funds in your Flash wallet'
  );

  const result = page.getByTestId(
    'purchase-result'
  );

  await expect(result).toContainText(
    'Not enough funds in your Flash wallet'
  );
});