# Data Types

This API provides information about data types.

## GET `/api/v1/data-types`

Requires a user email in the `x-user-email` header.

Response Body:

```json
[
  {
    "name": "string",
    "widget": {
      "name": "textbox"
    }
  }
]
```

`widget` will have a name of one of:
 - `textbox`
 - `textarea`
 - `numberbox`
 - `checkbox`
 - `dropdown`

If the widget is a dropdown, it will also have a `options` field, which is an array of strings.

## GET `/api/v1/data-types/conversions`

Response Body:

```json
[
  {
    "from": "string",
    "to": "number"
  }
]
```