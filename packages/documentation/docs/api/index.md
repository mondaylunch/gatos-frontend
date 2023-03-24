# API Documentation

This documents all of the particular details of the Gatos API.

Browse by route:

- [/api/v1/flows](flows)
- [/api/v1/login](login)
- [/api/v1/sign_up](sign_up)

## Authentication

Some routes require authentication, you must provide a JWT token, acquired from Auth0, as a Bearer token in the `Authorization` header.

Some routes require a user email in the `x-user-email` header.
