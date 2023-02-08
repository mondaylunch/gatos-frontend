import { expect, test } from "@playwright/test";

const URL = "http://localhost:5173/";

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(URL);
});

test("it loads the Homepage", async ({ page }) => {
    await expect(page).toHaveScreenshot();
});

test("page has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Gatos")
});

test("redirect to login page", async ({ page }) => {
    await page.getByRole("button", {name: "Log in"}).click();
    await expect(page).toHaveURL("http://localhost:5173/login")
});

test("redirect to sign up page", async ({ page }) => {
    await page.getByRole("button", {name: "Sign up"}).click();
    await expect(page).toHaveURL("http://localhost:5173/signup")
});

test("page has two buttons", async ({ page }) => {
    const all_buttons = await page.locator("button").count();
    expect(all_buttons).toBe(2);
});