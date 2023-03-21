# Any: To String

This node will stringify any given input.

| Input     | Configuration | Output         |
| --------- | ------------- | -------------- |
| data: any |               | output: string |

Conversions for different data types:

| Data               | Output            |
| ------------------ | ----------------- |
| "string"           | `"string"`        |
| true               | `"true"`          |
| { key: "value" }   | `{"key":"value"}` |
| 5.67               | `"5.67"`          |
| [ "test", "list" ] | `["test","list"]` |
| optional["text"]   | "text"            |
| optional[]         | ""                |
