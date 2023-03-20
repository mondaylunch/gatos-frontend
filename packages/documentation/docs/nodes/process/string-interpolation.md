# String: Interpolation

This node is given a string template optionally with variables to replace part of the string with in order to create a new string.

| Input                                 | Configuration    | Output         |
| ------------------------------------- | ---------------- | -------------- |
| \*\*variables: { [variable]: string } | template: string | output: string |

The template string can include variables like so:

```
Hello, {}!
```

This will add an input variable `Placeholder 1` to the node.

The template string can also include named variables like so:

```
Hello, {name}!
```

This will add an input variable `name` to the node.
