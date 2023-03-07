# Flows

This API provides CRUD for flows.

## GET `/api/v1/flows`

> [Requires authentication.](/api/#authentication)

Response Body:

```json
[
  {
    "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
    "name": "Flow Name",
    "description": "Flow Description",
    "authorId": "048f7d91-f6cc-4afc-9210-00878f188a84"
  }
]
```

## POST `/api/v1/flows`

> [Requires authentication.](/api/#authentication)

Request Body:

```json
{
  "name": "Flow Name",
  "description": "Flow Description"
}
```

Description is optional.

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "name": "Flow Name",
  "description": "Flow Description",
  "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84"
}
```

## PATCH `/api/v1/flows/{flowId}`

> [Requires authentication.](/api/#authentication)

Request Body:

```json
{
  "name": "Flow Name",
  "description": "Flow Description"
}
```

Either name or description can be omitted.

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "name": "Flow Name",
  "description": "Flow Description",
  "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84"
}
```

## DELETE `/api/v1/flows/{flowId}`

> [Requires authentication.](/api/#authentication)

No response body.
