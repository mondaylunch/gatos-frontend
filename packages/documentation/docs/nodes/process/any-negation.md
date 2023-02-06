# Any: Negation

This node will take the negation of a given value. This is the opposite of the [truthiness node](any-truthiness).

| Input      | Configuration | Output          |
| ---------- | ------------- | --------------- |
| input: any |               | result: boolean |

Outputs for different data types:

| Data               | Output |
| ------------------ | ------ |
| "string"           | false  |
| ""                 | true   |
| true               | false  |
| false              | true   |
| { key: "value" }   | false  |
| { }                | false  |
| 0                  | true   |
| 5.67               | false  |
| [ "test", "list" ] | false  |
| [ ]                | false  |
| optional["text"]   | false  |
| optional[]         | true   |
