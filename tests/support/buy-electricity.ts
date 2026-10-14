import { Page } from '@playwright/test';

// Export an asynchronous helper function to automate filling out and submitting an electricity purchase form
export async function sendMoney(page: Page, meter: string, amount: string) {
  // Locate the 'Meter number' input field by its label and fill it with the provided meter value
  await page.getByLabel('Meter number').fill(meter);
  
  // Locate the 'Amount (R)' input field by its label and fill it with the specified amount value
  await page.getByLabel('Amount (R)').fill(amount);
  
  // Locate the 'Buy electricity' submit button by its role and name, then click it
  await page.getByRole('button', { name: 'Buy electricity' }).click();
}