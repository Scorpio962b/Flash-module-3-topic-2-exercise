import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('14. Check the request', async ({ page, request }) => {

  const accountID = await createAccount(
    request,
    '500.00'
  );

  const meterNumber = '12345678901';
  const amount = '50.00';

  const requestPromise = page.waitForRequest(
    `**/api/accounts/${accountID}/electricity`
  );

  await page.goto(
    `/electricity?account=${accountID}`
  );

  await sendMoney(
    page,
    meterNumber,
    amount
  );

  const apiRequest = await requestPromise;

  const requestBody = apiRequest.postDataJSON();

  expect(requestBody).toEqual({
    meterNumber: '12345678901',
    amount: '50.00',
  });
});