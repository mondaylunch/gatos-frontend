# Object: Remap Variable(s)

This node can take an object and output it with different keys.

| Input         | Configuration                         | Output                             |
| ------------- | ------------------------------------- | ---------------------------------- |
| input: object | mapping: { [key of input]: variable } | \*\*variables: { [variable]: any } |

For example, for a given object:

```json
{
  "hello": "world",
  "keyA": 1,
  "keyB": true
}
```

And the mapping given as:

```json
{
  "hello": "world",
  "keyA": "keyC"
}
```

Will produce the object:

```json
{
  "world": "world",
  "keyC": 1,
  "keyB": true
}
```
