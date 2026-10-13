import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('16. Patch the account response balance', async ({
  page,
  request,
}) => {

  const accountID = await createAccount(
    request,
    '500.00'
  );

  await page.route(
    `**/api/accounts/${accountID}`,
    async (route) => {

      const response = await route.fetch();

      const body = await response.json();

      body.balance = 'R999.00';

      await route.fulfill({
        response,
        json: body,
      });
    }
  );

  await page.goto(
    `/electricity?account=${accountID}`
  );

  await expect(
    page.getByText('R999.00')
  ).toBeVisible();
});