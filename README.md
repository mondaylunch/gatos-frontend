# Gatos – Frontend

This monorepo contains the frontend component of Gatos.

**Contributors**

- {names withheld}

## Deployed Software

The frontend component is deployed at https://mondaylunch.club.

{access information withheld}

## Prerequisites

- Install [Node.js 16 or later](https://nodejs.org/en/)
- Install [pnpm](https://pnpm.io/installation)

## Quick Start

You must provide some secrets in a `.env` file in the root of the project, the following variables are required ([learn more about how to create these here](https://docs.mondaylunch.club/deployment)):

```dotenv
AUTH0_CLIENT_ID=[Auth0 client ID]
AUTH0_CLIENT_SECRET=[Auth0 client secret]
AUTH0_AUTHORIZATION_LINK=[Auth0 authorization link, looks like https://<domain>/authorize]
AUTH0_ISSUER=[Auth0 issuer URL]
AUTH0_AUDIENCE=[Auth0 API audience]
AUTH0_TOKEN_URL=[Auth0 API token URL, looks like https://<domain>/oauth/token]
```

To get started, clone this repository and run:

```bash
# install dependencies
pnpm i

# run the frontend
pnpm dev
```

You can now access the website at http://localhost:5173. (the backend must be running to use)

To run and generate a run configuration for the frontend in IntelliJ you can open `package.json` and press the play button.

### Documentation

You can also start the documentation by running:

```bash
# start documentation
pnpm run docs
```

This website is also available online at https://docs.mondaylunch.club

## Building for Production

This repository comes equipped with CI to automatically build production Docker images from the main branch.

To build this yourself, simply run:

```bash
docker build -t ghcr.io/mondaylunch/gatos-frontend:master -f Dockerfile .
```

You may want to use a different tag, but this will replace your deployment image if you are using the default configuration.

## Run Tests

Prepare environment for testing:

```bash
# download browser binaries
pnpm test:install
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
