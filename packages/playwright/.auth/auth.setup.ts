import { test as setup } from '@playwright/test';

const authFile = 'user.json';

setup('authenticate', async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post("http://localhost:5173/signup", {
    form: {
        'username': 'username',
        'email': 'email',
        'password': 'password',
        'confirm-password': 'password'
    }

    })
  await request.post("http://localhost:5173/login", {
    form: {
      'email': 'email',
      'password': 'password'
    }
  });
  await request.storageState({ path: authFile });
});