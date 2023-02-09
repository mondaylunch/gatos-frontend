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

test("page has the correct username field", async ({ page }) => {
    const username = page.locator(`[name=username]`);
    await expect(username).toHaveAttribute("type", "text");
});

test("page has the correct email field", async ({ page }) => {
    const email_address = page.locator(`[name=email]`);
    await expect(email_address).toBeEmpty();
    await expect(email_address).toHaveAttribute("type", "email");

    await email_address.fill("wrongEmail");
    await expect(email_address).toHaveValue("wrongEmail");
    await page.getByRole("button", {name: "Sign up"}).click();
    expect(email_address).toThrowError;
    
    await email_address.fill("jeroen.isthebest@example.org");
    await expect(email_address).toHaveValue("jeroen.isthebest@example.org");
    await page.getByRole("button", {name: "Sign up"}).click();
    expect(email_address).not.toThrowError;
});

test("page has the correct password fields", async ({ page }) => {
    const password = page.locator(`[name=password]`);
    const confirm_password = page.locator(`[name=confirm-password]`);
    await expect(password).toBeEmpty();
    await expect(confirm_password).toBeEmpty();
    await expect(password).toHaveAttribute("type", "password");
    await expect(confirm_password).toHaveAttribute("type", "password");
});
