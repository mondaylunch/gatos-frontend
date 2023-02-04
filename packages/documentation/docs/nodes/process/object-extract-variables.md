# Object: Extract Variable(s)

This node can take an object and destruct it into variables from keys in the object.

| Input         | Configuration          | Output                             |
| ------------- | ---------------------- | ---------------------------------- |
| input: object | keys: (key of input)[] | \*\*variables: { [variable]: any } |

For example, for a given object:

```json
{
  "hello": "world",
  "keyA": 1,
  "keyB": true
}
```

And the keys configuration `[hello, keyB]`, will output the two keys out of the node.
