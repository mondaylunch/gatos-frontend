import { expect, test } from "@playwright/test";
import { text } from "stream/consumers";

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

test("page has two buttons", async ({ page }) => {
    const all_buttons = await page.locator("button").count();
    expect(all_buttons).toBe(2);
});

test("clicking button redirects to login/signup page", async ({ page }) => {
    await page.click("text=Login or Sign Up");
    await expect(page).toHaveURL("http://localhost:5173/api/auth/signin?csrf=true");
});