import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('Check the request sent by the UI', async ({ page, request }) => {
  const id = await createAccount(request);
  await page.goto(`/electricity?account=${id}`);

  const requestPromise = page.waitForRequest(
    r => r.url().endsWith(`/api/accounts/${id}/electricity`) && r.method() === 'POST'
  );
  await sendMoney(page, '12345678901', '50.00');

  expect((await requestPromise).postDataJSON()).toEqual({
    meterNumber: '12345678901',
    amount: '50.00',
  });
});
