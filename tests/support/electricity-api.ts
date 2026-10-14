import { APIRequestContext, expect } from '@playwright/test';

// Export an asynchronous helper function to create a new test account via API with an optional starting balance
export async function createAccount(request: APIRequestContext, balance = '500.00'): Promise<string> {
  // Send a POST request to the accounts API endpoint to create a new account with the specified starting balance
  const response = await request.post('/api/accounts', { data: { startingBalance: balance } });
  
  // Assert that the account was successfully created with a 201 Created status code
  expect(response.status()).toBe(201);
  
  // Parse the response JSON and return the newly generated account identifier
  return (await response.json()).accountId;
}