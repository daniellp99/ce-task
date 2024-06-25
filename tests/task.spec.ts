import { test, expect } from "@playwright/test";

test("Page renders an input and a button", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Check for the presence of an input element with a specific placeholder
  const inputElement = page.locator(
    'input[placeholder="Type to add new task"]'
  );
  await expect(inputElement).toBeVisible();

  // Check for the presence of a button
  const buttonElement = page.locator('button[type="submit"]');
  await expect(buttonElement).toBeVisible();
});
