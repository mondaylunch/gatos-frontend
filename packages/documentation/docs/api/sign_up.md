# Sign Up

This API allows users to authenticate with the platform.

## GET `/api/v1/sign_up/check_username/{username}`

Response Body:

```json
{
  "in_use": true
}
```

## POST `/api/v1/sign_up`

Request Body:

```json
{
  "username": "User",
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
  "password": "password"
}
```
