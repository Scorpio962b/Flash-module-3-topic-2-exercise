import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('API: a valid electricity purchase returns 201', async ({ request }) => {
  const accountID = await createAccount(request, '500.00');

  const response = await request.post(
    `/api/accounts/${accountID}/electricity`,
    {
      data: {
        meterNumber: '12345678901',
        amount: '50',
      },
    }
  );
console.log('Account ID:', accountID);
console.log('Request URL:', response.url());
console.log('Status:', response.status());
console.log('Response body:', await response.text());

expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toMatchObject({
    result: 'success',
    balance: 'R450.00',
  });

//   /open expression ^start of string \d any digit (0-9){4} exactly 4 of them
//   ( open group -a literal hyphen \d any digit (0-9) {4} exactly 4 of them
//   ) close group {4} repeat the whole group exactly 4 times $ end of string
//   /close expression
  expect(body.token).toMatch(/^\d{4}(-\d{4}){4}$/);

});