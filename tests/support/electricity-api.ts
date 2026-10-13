import { APIRequestContext, expect } from '@playwright/test';

export async function createAccount(request: APIRequestContext, balance = '500.00'): Promise<string> {
  const response = await request.post('/api/accounts', { data: { startingBalance: balance } });
  expect(response.status()).toBe(201);
  return (await response.json()).accountId;
}
