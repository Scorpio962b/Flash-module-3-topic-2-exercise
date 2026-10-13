import { APIRequestContext, expect } from "@playwright/test";

// create a new account through the API and return the ID
export async function createAccount(
  request: APIRequestContext,
  accountBalance : string,
): Promise<string> {
  const response = await request.post("/api/accounts", {
    data: { accountBalance },
  });
  expect(response.status()).toBe(201);
  const accounts = await response.json();
  console.log('Create account response:', accounts);
  return accounts.accountId;
 
}
