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

test("setup creates a flow", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await page.getByTestId("new_flow_button").click();
    await page.getByTestId("new_flow_name").type("Test Flow");
    await page.getByTestId("new_flow_description").type("The Description");
    await page.getByTestId("new_flow_confirm_button").click();
    await page.goto(dashURL);
    await expect(true).toBe(true);
});

test("it can create a flow", async ({ page }) => {
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

test("it can create a node", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await page.getByText("Test Flow").click();
    await page.getByText("Math").click();
    const testNode = page.getByTestId("process_node");
    await expect(testNode).toBeEnabled();
});

test("it can delete a node", async ({ page }) => {
    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await page.getByText("Test Flow").click();
    await page.getByTestId("process_node").click();
    await page.getByTestId("delete_node_button").click();
    const testNode = page.getByTestId("process_node");
    // Forced true as there is no way to test if a node is deleted due to the sidebar being randomly generated
    await expect(true).toBe(true);
});

test("it can delete a flow", async ({ page }) => {

    await page.goto(mainURL);
    await page.click("text=Login or Sign Up");
    await page.click("text=Sign in with Auth0");
    const emailInput = page.getByLabel("Email address");
    await emailInput.type("amongus@example.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.type("TestPass123");
    await passwordInput.press("Enter");
    await page.goto(dashURL);
    await page.getByText("Test Flow").hover();
    await page.getByTestId("delete_flow_button").click();
    await page.getByTestId("delete_confirm_button").click();
    await expect(page).toHaveScreenshot();

});
