---
sidebar_position: 1
---

# Gatos Documentation

Welcome to the documentation for Gatos, this software was developed as a submission for the 5CCS2SEG (Software Engineering Group Project) major group assignment.

# Create Flow: Example

1. To create a flow we need to surround the flow with one of the start and end nodes so that the flow is executable. For this example we will use trigger webhook like so:

![WebHooks](/img/flow/start-end.png)

2. Now connect the webhooks by dragging the reference from the trigger webhook to the response webhook like so:

![Connection](/img/flow/connect-webhook.png)

3. Create your flow this could be anything you want but for this example we will create a flow that checks if the additions of two numbers is being done correctly. (we are adding the numbers 5 + 5 and checking if it equals 10)

> Note: After finising your flow add a set object field node to the output of your flow

![Example-flow](/img/flow/example-flow.png)

4. Now lets display this as json data!

   - Use the output of the flow as the input of the Set Object Field.
   - Use request body from the trigger webhook as another input of the Set Object Field node.
   - Finally, use the output of the Set Object Field node as an input for the Respond to Webhook node.

   This should give you the following flow:

![full-flow](/img/flow/full-flow.png)

5. Click Execute

![result](/img/flow/result.png)

## Data Types

> Note: the following data types have been used throughout the project and therefore are included here for the sake of easy access.

- Any
- String
- Boolean
- Object
  - JSON
  - Reference
  - Node
- Number
- List[x]
- Optional[x] (alternative syntax `?x`)

## Discord Data Types

- Guild ID
- Channle ID
- User ID
- Role ID
- Emoji ID
- Slash Command Event
- Message
- Message Embed
