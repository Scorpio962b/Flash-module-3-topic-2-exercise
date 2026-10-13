import { Page } from '@playwright/test';

// Fills the Send money form and submits it, exactly as a customer would.​

export async function sendMoney(page: Page, meter: string, amount: string): Promise<void> {
  await page.getByLabel('Meter number').fill(meter);
  await page.getByLabel('Amount (R)').fill(amount);
  await page.getByRole('button', { name: 'Buy electricity' }).click();

}