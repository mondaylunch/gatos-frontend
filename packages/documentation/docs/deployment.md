---
sidebar_position: 2
---

# Deployment

This guide explains everything required to run Gatos in production.

## Prerequisites

- Docker
- Docker Compose v3+

## 1. Configure server and DNS

To begin, find a server to deploy to, any VPS with a public IP works.

Configure two DNS records to point to your server:

- `A your.domain` to your IP (this will be referred to as `<frontend origin>`)
- `A api.your.domain` to your IP (this will be referred to as `<backend origin>`)

![DNS](/img/examples/dns.png)

## 2. Configure Auth0

Go to https://auth0.com and create a new tenant by signing up.

![Auth0 Login](/img/examples/auth0-login.png)

Once logged in, go to "Applications" and select "+ Create Application":

![Auth0 Applications](/img/examples/auth0-applications.png)

Select "Regular Web Application":

![Auth0 New App](/img/examples/auth0-new-app.png)

Open settings and make note of the domain (referred to as `<your tenant>`), client ID, and client secret:

![Auth0 New App](/img/examples/auth0-app-settings.png)

Scroll down to "Allowed Callback URLs" and set (replacing angled brackets with URLs from earlier):

```
https://<backend origin>/login/oauth2/code/auth0, https://<frontend origin>/api/auth/callback/auth0
```

Also change "Allowed Logout URLs":

```
https://<frontend origin>
```

Then scroll to the end and save settings.

Now go to "APIs", and select "+ Create API":

![Auth0 APIs](/img/examples/auth0-apis.png)

Fill out the details with a name and identifier (just set this to API origin, this will be the `audience url` later):

![Auth0 APIs](/img/examples/auth0-new-api.png)

Now select the new API you just created, go to "Machine To Machine Applications" and authorize the app created earlier.

![Auth0 APIs](/img/examples/auth0-authorize-api.png)

You now have the required configuration.

## 3. Deploy

Create a new directory for the deployment.

Within the directory create a `docker-compose.yml`:

```yml
version: "3"

services:
  database:
    image: mongo
    restart: always
    volumes:
      - ./db:/data/db

  frontend:
    image: ghcr.io/mondaylunch/gatos-frontend:master
    env_file: .env
    depends_on:
      - database
    environment:
      - API_URL=http://backend:8080
    restart: always
    ports:
      # change left-hand side assignment if not suitable
      - 3000:3000

  backend:
    image: ghcr.io/mondaylunch/gatos-backend-api:master
    env_file: .env
    environment:
      - MONGODB_URI=mongodb://database
    depends_on:
      - database
    restart: always
    ports:
      # change left-hand side assignment if not suitable
      - 8080:8080
```

And create an `.env` file and populate with your keys:

```dotenv
# Auth0 Tenant Information
AUTH0_AUDIENCE=https://<audience url>
AUTH0_TOKEN_URL=https://<your tenant>.auth0.com/oauth/token
AUTH0_MANAGEMENT_AUDIENCE=https://<your tenant>.auth0.com/api/v2/
AUTH0_ISSUER=https://<your tenant>.auth0.com/
AUTH0_AUTHORIZATION_LINK=https://<your tenant>.auth0.com/authorize

# Auth0 Client ID
AUTH0_CLIENT_ID=

# Auth0 Client Secret
AUTH0_CLIENT_SECRET=

# Public Host
NEXTAUTH_URL=https://<frontend origin>

# JWT Secret
# `openssl rand -base64 32`
# or go to: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=

# Cookie Secret
# `openssl rand -hex 32`
# or go to: https://generate-secret.vercel.app/64
AUTH_SECRET=
```
