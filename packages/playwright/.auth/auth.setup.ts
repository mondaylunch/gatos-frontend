import { test as setup } from '@playwright/test';

const mainURL = "http://localhost:5173/";
const authFile = ".auth/user.json";

setup('authenticate', async ({ page }) => {
  await page.goto(mainURL);
  await page.click("text=Login or Sign Up");
  await page.click("text=Sign in with Auth0");
  await page.getByLabel("Email address").fill("username");
  await page.getByLabel("Password").fill("password");
  await page.click("text=Continue");
  await page.context().storageState({ path: authFile });

});