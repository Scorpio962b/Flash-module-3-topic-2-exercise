import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('API: a valid electricity purchase returns 201', async ({ request }) => {
  const id = await createAccount(request);
  const response = await request.post(`/api/accounts/${id}/electricity`, {
    data: { meterNumber: '12345678901', amount: '50' },
  });

  expect(response.status()).toBe(201);
  expect(await response.json()).toMatchObject({
    result: 'success',
    balance: 'R450.00',
    token: expect.stringMatching(/^\d{4}(-\d{4}){4}$/),
  });
});
