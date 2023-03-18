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

Open settings and make note of the domain, client ID, and client secret:

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
    restart: always
```

And create an `.env` file and populate with your keys:

```dotenv
# Auth0 Tenant Information
AUTH0_TOKEN_URL=https://<your tenant>.auth0.com/oauth/token
AUTH0_AUDIENCE=https://<your tenant>.mondaylunch.club
AUTH0_MANAGEMENT_AUDIENCE=https://<your tenant>.auth0.com/api/v2/
AUTH0_ISSUER=https://<your tenant>.auth0.com/
VITE_AUTH0_ISSUER=https://<your tenant>.auth0.com

# Auth0 Client ID
AUTH0_CLIENT_ID=
VITE_AUTH0_ID=

# Auth0 Client Secret
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=

# cookie hash secret; this should be random data
AUTH_SECRET=409urfj439208fru432jr89043jwrufw3498prfj4uru3wjp90r8f34jr
```
