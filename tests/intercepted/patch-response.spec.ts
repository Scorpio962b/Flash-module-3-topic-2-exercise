import { test, expect } from '@playwright/test';
import { createAccount } from '../support/electricity-api';

test('Patch the account balance shown in the UI', async ({ page, request }) => {
  const id = await createAccount(request);
  await page.route(`**/api/accounts/${id}`, async route => {
    const response = await route.fetch();
    await route.fulfill({ response, json: { ...(await response.json()), balance: 'R999.00' } });
  });

  await page.goto(`/electricity?account=${id}`);
  await expect(page.getByText('R999.00')).toBeVisible();
});
