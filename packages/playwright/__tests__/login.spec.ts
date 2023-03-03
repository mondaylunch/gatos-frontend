import { expect, test } from "@playwright/test";

const URL = "http://localhost:5173/login";

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(URL);
});

test("page has two buttons", async ({ page }) => {
    const all_buttons = await page.locator("button").count();
    expect(all_buttons).toBe(2);
});

test("page has 2 fields", async ({ page }) => {
    const all_fields = await page.locator("input").count();
    expect(all_fields).toBe(2);
});

test("page has the correct email field", async ({ page }) => {
    const email_address = page.locator(`[name=email]`);
    expect(email_address).toBeEmpty();
    await expect(email_address).toHaveAttribute("type", "email");
});

test("page has the correct password field", async ({ page }) => {
    const password = page.locator(`[name=password]`);
    await expect(password).toBeEmpty();
    await expect(password).toHaveAttribute("type", "password");
});
