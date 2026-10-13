import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('A purchase is recorded', async ({ page, request }) => {
  const id = await createAccount(request);
  await page.goto(`/electricity?account=${id}`);

  const responsePromise = page.waitForResponse(
    r => r.url().includes(`/api/accounts/${id}/electricity`) && r.request().method() === 'POST'
  );
  await sendMoney(page, '12345678901', '50');
  const response = await responsePromise;

  expect(response.status()).toBe(201);
  const { token } = await response.json();
  expect(token).toMatch(/^\d{4}(-\d{4}){4}$/);
  await expect(page.getByTestId('purchase-result')).toContainText(/electricity purchased/i);
  await expect(page.getByTestId('purchase-token')).toContainText(token);
  await expect(page.getByTestId('account-balance')).toHaveText('R450.00');

  expect((await (await request.get(`/api/accounts/${id}`)).json()).balance).toBe('R450.00');
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([
    { token, meterNumber: '12345678901', amount: 'R50.00' },
  ]);
});
