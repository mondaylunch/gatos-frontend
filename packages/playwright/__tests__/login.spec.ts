import { expect, test, Page } from "@playwright/test";

const mainURL = "http://localhost:5173/";
const dashURL = "http://localhost:5173/dash";
const flowURL = "http://localhost:5173/flows/1";

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(mainURL);
});

test.afterAll(async () => {
    await page.close();
});

test("it loads dashboard", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await expect(page).toHaveScreenshot();
});

test("it loads flow page", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(flowURL);
    await expect (page).toHaveScreenshot();
});