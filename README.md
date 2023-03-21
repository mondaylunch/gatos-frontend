# Gatos Frontend

This repository contains the Gatos website.

## Prerequisites

- Install [Node.js 16 or later](https://nodejs.org/en/)
- Install [pnpm](https://pnpm.io/installation)

## Run the frontend

```bash
# install dependencies
pnpm i

# run the frontend
pnpm dev
```

To run and generate a run configuration for the frontend in IntelliJ you can open `package.json` and press the play button.

## Integration Testing

Prepare environment for testing:

```bash
# download browser binaries
pnpm test:install
```

Run tests:

```bash

# run basic test to see if the website works
npx playwright test packages/playwright/__tests__/main-page.spec.ts

# run test to see if the login works
npx playwright test packages/playwright/__tests__/login.spec.ts

```

Run tests:

```bash

# run basic test to see if the website works
npx playwright test packages/playwright/__tests__/main-page.spec.ts

# run test to see if the login works
npx playwright test packages/playwright/__tests__/login.spec.ts

```

Start the dev server in the background:

```bash
# run the frontend
pnpm dev &
```

Run tests:

```bash
# run integration tests
pnpm test:integration
```

## Open the documentation

```bash
# run Docusaurus
pnpm run docs
```
