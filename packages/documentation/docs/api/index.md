# API Documentation

This documents all of the particular details of the Gatos API.

Browse by route:

- [/api/v1/flows](flows)
- [/api/v1/login](login)
- [/api/v1/sign_up](sign_up)

## Authentication

Some routes require authentication, you must provide the following data:

| Header         | Value                  |
| -------------- | ---------------------- |
| `x-auth-token` | Token created on login |
