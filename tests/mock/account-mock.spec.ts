import { test, expect } from '@playwright/test';

const ACCOUNT_API = '**/api/accounts/A-MOCK';
const ELECTRICITY_API = '**/api/accounts/A-MOCK/electricity';
// const INSUFFICIENT_FUNDS = 'Not enough funds in your Flash wallet';

test.beforeEach(async ({ page }) => {
  // Every test starts with a mocked account holding R500.00. No real API is called.
  await page.route(ACCOUNT_API, (route) =>
    route.fulfill({ json: { accountId: 'A-MOCK', balance: 'R500.00' } }),
  );
});

test('UI: a successful electricity purchase is displayed', async ({ page }) => {
  await page.route(ELECTRICITY_API, (route) =>
    route.fulfill({
      status: 201,
      json: {
        result: 'success',
        message: 'Electricity purchased',
        token: '0000-0000-0000-0000-0005',
        balance: 'R450.00',
      },
    }),
  );
  // ...your existing steps: open the page, fill the form, click buy
  const result = page.getByTestId('purchase-result');
});

// test('UI: insufficient funds shows an error', async ({ page }) => {
//   await page.route(ELECTRICITY_API, (route) =>
//     route.fulfill({
//       status: 422,
//       json: { result: 'error', message: INSUFFICIENT_FUNDS, balance: 'R500.00' },
//     }),
//   );

//   // ...your existing steps

//   await expect(page.getByTestId('purchase-result')).toContainText(INSUFFICIENT_FUNDS);
// });