import { expect, test } from "@playwright/test";

test("it loads the Homepage", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveScreenshot();
});

test("page has correct title", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle("Gatos")
});

test("redirect to login page", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("button", {name: "Log In"}).click();
  //http://localhost:5173/login
  await expect(page).toHaveURL("http://localhost:5173/login")
});

test("it loads the Editor", async ({ page }) => {
  await page.goto("http://localhost:5173/flows/1");
  await expect(page).toHaveScreenshot();
});
