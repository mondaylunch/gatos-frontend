import { expect, test } from "@playwright/test";

test("page has correct title", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page).toHaveTitle("Gatos")
});

test("redirect to login page", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.getByRole("button", {name: "Log in"}).click();
    await expect(page).toHaveURL("http://localhost:5173/login")
});

test("redirect to sign up page", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.getByRole("button", {name: "Sign up"}).click();
    await expect(page).toHaveURL("http://localhost:5173/signup")
});

test("page has two buttons only", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.getByRole("button", {name: "Sign up"}).click();
    await expect(page).toHaveURL("http://localhost:5173/signup")
});

