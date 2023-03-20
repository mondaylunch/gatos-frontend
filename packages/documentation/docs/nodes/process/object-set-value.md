# Object: Set Value

This node sets the object's key to the element provided and returns the new object.

| Input           | Configuration  | Output         |
| --------------- | -------------- | -------------- |
| object: object  | key: string    | output: object |
| element: object |                |                |

> Note: this node is also used to add completely new keys as well as replace mappings. 

For example, for a given object:
```json
{
  "hello": "world"
}
```

and the element
```json
"people"
```

And the keys configuration `hello`, will output will be:
```json
{
  "hello": "people"
}
```
