import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';
import { sendMoney } from '../support/buy-electricity';

test('A refused purchase leaves no trace', async ({ page, request }) => {
  const id = await createAccount(request);
  await page.goto(`/electricity?account=${id}`);
  await sendMoney(page, '12345678901', '501');

  await expect(page.getByTestId('purchase-result')).toContainText('Not enough funds in your Flash wallet');
  expect((await (await request.get(`/api/accounts/${id}`)).json()).balance).toBe('R500.00');
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([]);
});
