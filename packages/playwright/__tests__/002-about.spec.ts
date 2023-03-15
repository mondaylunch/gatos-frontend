import { expect, test, Page } from "@playwright/test";

const mainURL = "http://localhost:5173/";
const dashURL = "http://localhost:5173/dash";

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(mainURL);
});

test.afterAll(async () => {
    await page.close();
});

test("it loads about page", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await page.getByText("About").click();
    await expect(page).toHaveScreenshot();
});
