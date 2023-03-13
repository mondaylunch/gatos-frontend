import { expect, test, chromium } from "@playwright/test";

const mainURL = "http://localhost:5173/";
const dashURL = "http://localhost:5173/dash";
const flowURL = "http://localhost:5173/flows/1";

test.beforeEach(async ({page}, testInfo) => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(mainURL);
});

test("it loads dashboard", async ({ page }) => {
    await page.goto(dashURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    // Under email address input "amongus@example.com" and password input "TestPass123"
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com", {delay: 100});
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123", {delay: 100});
    await passwordInput.press("Enter");
    await expect(page).toHaveScreenshot();
    page.close();
});

test("it loads flow page", async ({ page }) => {
    await page.goto(dashURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    // Under email address input "amongus@example.com" and password input "TestPass123"
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com", {delay: 100});
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123", {delay: 100});
    await passwordInput.press("Enter");
    await page.goto(flowURL);
    await expect (page).toHaveScreenshot();
    page.close();
});