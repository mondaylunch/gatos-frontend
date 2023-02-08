import { expect, test } from "@playwright/test";

test("it loads the Homepage", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveScreenshot();
});

test("it loads the Editor", async ({ page }) => {
  await page.goto("http://localhost:5173/flows/1");
  await expect(page).toHaveScreenshot();
});
