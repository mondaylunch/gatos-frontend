# Any: Truthiness

This node will take the truthiness of a given value.

| Input      | Configuration | Output          |
| ---------- | ------------- | --------------- |
| input: any |               | result: boolean |

Outputs for different data types:

| Data               | Output |
| ------------------ | ------ |
| "string"           | true   |
| ""                 | false  |
| true               | true   |
| false              | false  |
| { key: "value" }   | true   |
| { }                | true   |
| 0                  | false  |
| 5.67               | true   |
| [ "test", "list" ] | true   |
| [ ]                | true   |
| optional["text"]   | true   |
| optional[]         | false  |
