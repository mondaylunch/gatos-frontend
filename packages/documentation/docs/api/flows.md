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
    "authorId": "048f7d91-f6cc-4afc-9210-00878f188a84",
    "graph": [..]
  }
]
```

## POST `/api/v1/flows`

> [Requires authentication.](/api/#authentication)

Request Body:

```json
{
  "name": "Flow Name"
}
```

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "name": "Flow Name",
  "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "graph": [..]
}
```

## PATCH `/api/v1/flows/{flowId}`

> [Requires authentication.](/api/#authentication)

Request Body:

```json
{
  "name": "Flow Name"
}
```

Response Body:

```json
{
  "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "name": "Flow Name",
  "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
  "graph": [..]
}
```

## DELETE `/api/v1/flows/{flowId}`

> [Requires authentication.](/api/#authentication)

No response body.
