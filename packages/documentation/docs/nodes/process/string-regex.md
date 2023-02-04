# String: Regex

This node can match a given Regex against a string.

> For now this only supports doing a single match.

| Input         | Configuration | Output           |
| ------------- | ------------- | ---------------- |
| input: string | regex: Regex  | isMatch: boolean |
|               |               | match: string    |
|               |               | \*groups: string |

For example, given the input string "Hello" and Regex `/H(e)(l)lo/`, this node will output:

- isMatch: `true`
- match: `Hello`
- group[0]: `e`
- group[1]: `l`

For example, given the input string "World" and Regex `/H(e)(l)lo/`, this node will output:

- isMatch: `false`
- match: null
- group[0]: null
- group[1]: null
