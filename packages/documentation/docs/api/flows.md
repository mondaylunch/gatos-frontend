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
        "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84"
    }
]
```

## GET `/api/v1/flows/{flowId}`

> [Requires authentication.](/api/#authentication)

Response Body:

```json
{
    "_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
    "name": "Flow Name",
    "description": "Flow Description",
    "author_id": "048f7d91-f6cc-4afc-9210-00878f188a84",
    "graph": {
        "nodes": [
            {
                "id": "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
                "type": "start_node",
                "settings": {
                    "setting": {
                        "type": "number",
                        "value": 0.0
                    }
                },
                "inputTypes": {}
            },
            {
                "id": "6f8de627-706d-4817-8921-73bff23006a8",
                "type": "process_node",
                "settings": {
                    "setting": {
                        "type": "list$number",
                        "value": [
                            20.0,
                            3.0
                        ]
                    }
                },
                "inputTypes": {
                    "process_input": "number"
                }
            },
            {
                "id": "b15f484f-4345-4f30-9162-5210b4ff1433",
                "type": "end_node",
                "settings": {
                    "setting": {
                        "type": "optional$number",
                        "value": {
                            "present": true,
                            "value": 1.5
                        }
                    }
                },
                "inputTypes": {
                    "end_input": "number"
                }
            }
        ],
        "connections": [
            {
                "output": {
                    "nodeId": "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
                    "name": "start_output",
                    "type": "number"
                },
                "input": {
                    "nodeId": "6f8de627-706d-4817-8921-73bff23006a8",
                    "name": "process_input",
                    "type": "number"
                }
            },
            {
                "output": {
                    "nodeId": "6f8de627-706d-4817-8921-73bff23006a8",
                    "name": "process_output",
                    "type": "number"
                },
                "input": {
                    "nodeId": "b15f484f-4345-4f30-9162-5210b4ff1433",
                    "name": "end_input",
                    "type": "number"
                }
            }
        ],
        "metadata": {
            "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd": {
                "xPos": 1.0,
                "yPos": 0.0
            }
        }
    }
}
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

## POST `/api/v1/flows/{flowId}/graph/nodes`

> [Requires authentication.](/api/#authentication)

Request Body:

```json
{
    "type": "string_length"
}
```

Response Body:

```json
{
    "id": "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
    "type": "string_length",
    "settings": {},
    "inputTypes": {
        "input": "string"
    }
}
```
