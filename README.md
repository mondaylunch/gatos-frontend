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

## Reference List

- **Tailwind CSS**:
  The frontend makes extensive use of Tailwind CSS as its framework. Source: (https://tailwindcss.com/)
- **Font Awesome Icons**: In the Font Awesome Free download, the CC BY 4.0 license applies to all icons packaged as .svg and .js files types. Source: (https://fontawesome.com/license/free)
- **Playwright Testing**: Frontend testing uses the Playwright Library under Apache License 2.0. Source (https://playwright.dev/)
- **PNPM Package Manager**: PNPM is used as the package manger under MIT licence. Source: (https://pnpm.io/)
- **Solid-Start**: Solid Start is used as a web framework under MIT licence. Source: (https://github.com/solidjs/solid-start)
- **Vitest**: A backup testing framework under MIT licence. Source(https://github.com/vitest-dev/vitest)
- **Solid JS**: Main web framework in use under MIT licence. Source(https://github.com/solidjs/solid)
- **Typescript**: Typescript is used for the majority of file types under Apache License 2.0 Licence. Source(https://github.com/microsoft/TypeScript)
- **Undici**: HTTP request handler under MIT Licence. Source (https://github.com/nodejs/undici)
- **Vite**: A frontend bundler under MIT Licence. Source (https://github.com/vitejs/vite)
- **LoDash**: JavaScript Library under MIT Licence. Source (https://github.com/lodash/lodash)
- **Autoprefixer**: CSS autoprefixer under MIT Licence. Source (https://github.com/postcss/autoprefixer)
- **Solid Icons**: Icon provider under MIT Licence. Source (https://github.com/x64Bits/solid-icons)
- **Auth0**: Auth0 is used as our authentication provider. Source (https://auth0.com/)
- **Docusaurus**: Docusaurus is used as our documentation platform. Source(https://github.com/facebook/docusaurus)

This site may contain links to other websites or content belonging to third parties. Such external links are not checked or monitored by us, We do not assume responsibility for any information offered by third-party websites linked through this site.
