# Login

This API allows users to authenticate with the platform.

## POST `/api/v1/login/authenticate`

Request Body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "username": "User",
  "email": "user@example.com",
  "password": "password",
  "auth_token": "token"
}
```

## GET `/api/v1/login/self`

> [Requires authentication.](/api/#authentication)

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "username": "User",
  "email": "user@example.com",
  "password": "password",
  "auth_token": "token"
}
```
