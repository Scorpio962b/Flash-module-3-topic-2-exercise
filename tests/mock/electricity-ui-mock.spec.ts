import { test, expect, } from "@playwright/test";
import { sendMoney } from "../support/buy-electricity";

test("UI: a successful electricity purchase is displayed", async ({ page }) => {
  await page.route("**/api/accounts/123/electricity", async (route) => {
    await route.fulfill({
      status: 201,
      json: {
        result: "success",
        message: "Electricity purchased successfully",
        token: "0000-0000-0000-0000-0005",
        balance: "R450.00",
      },
    });
  });
  // Open the electricity page
  await page.goto("/electricity?account=123");

  // Fill in the form and click Buy electricity
  await sendMoney(page, "12345678901", "50.00");

  // Verify the success message
  const result = page.getByTestId("purchase-result");

  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result", "success");
  await expect(result).toContainText(/electricity purchased/i);
});
