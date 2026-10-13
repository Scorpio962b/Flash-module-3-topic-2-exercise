import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('API:one rand over balance returns 422 and moves no money', async ({ request }) => {
  const accountID = await createAccount(request, '500.00');

  const response = await request.post(`/api/accounts/${accountID}/electricity`,{
      data: { meterNumber: '12345678901',amount: '501',},
    });

expect(response.status()).toBe(422);
const body = await response.json();
expect(body).toEqual({
    result: 'error',
    message: 'Not enough funds in your Flash wallet',
    balance: 'R500.00',
  });

  const history = await request.get(`/api/accounts/${accountID}/purchases`);
  expect(await history.json()).toEqual([]);
});