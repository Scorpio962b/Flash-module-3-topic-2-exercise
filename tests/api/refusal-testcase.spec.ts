import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('API: one rand over balance is refused without a purchase', async ({ request }) => {
  const id = await createAccount(request);
  const response = await request.post(`/api/accounts/${id}/electricity`, {
    data: { meterNumber: '12345678901', amount: '501' },
  });

  expect(response.status()).toBe(422);
  expect(await response.json()).toEqual({
    result: 'error',
    message: 'Not enough funds in your Flash wallet',
    balance: 'R500.00',
  });
  expect(await (await request.get(`/api/accounts/${id}/purchases`)).json()).toEqual([]);
});
