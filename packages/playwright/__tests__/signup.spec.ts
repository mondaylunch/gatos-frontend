import { expect, test } from "@playwright/test";

const URL = "http://localhost:5173/signup";

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(URL);
});

test("page has two buttons", async ({ page }) => {
    const all_buttons = await page.locator("button").count();
    expect(all_buttons).toBe(2);
});

test("page has 4 fields", async ({ page }) => {
    const all_fields = await page.locator("input").count();
    expect(all_fields).toBe(4);
});