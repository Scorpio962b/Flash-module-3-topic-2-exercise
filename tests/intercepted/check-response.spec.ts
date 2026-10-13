import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('Check the refusal response', async ({ page, request }) => {
  const id = await createAccount(request);
  await page.goto(`/electricity?account=${id}`);

  const responsePromise = page.waitForResponse(
    r => r.url().endsWith(`/api/accounts/${id}/electricity`) && r.request().method() === 'POST'
  );
  await sendMoney(page, '12345678901', '501');
  const response = await responsePromise;

  expect(response.status()).toBe(422);
  const { message } = await response.json();
  expect(message).toBe('Not enough funds in your Flash wallet');
  await expect(page.getByTestId('purchase-result')).toContainText(message);
});
