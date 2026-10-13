import { Page } from '@playwright/test';

export async function sendMoney(page: Page, meter: string, amount: string) {
  await page.getByLabel('Meter number').fill(meter);
  await page.getByLabel('Amount (R)').fill(amount);
  await page.getByRole('button', { name: 'Buy electricity' }).click();
}
