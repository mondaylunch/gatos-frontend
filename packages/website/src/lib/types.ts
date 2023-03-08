export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  auth_token: string;
};

export type NodeType = {
  name: string;
  category: "input" | "process" | "output";
};

type DataType = "number" | `optional$${string}` | `list$${string}`;

export type Setting =
  | {
  type: `optional$${string}`;
  value: {
    present: boolean;
    value: any;
  };
}
  | {
  type: `list$${string}`;
  value: any[];
}
  | {
  type: "number";
  value: number;
};

export type Node = {
  id: string;
  type: string;
  settings: Record<string, Setting>;
  inputTypes: Record<string, DataType>;
};

export type Connector = {
  nodeId: string;
  name: string;
  type: DataType;
};

export type Connection = {
  input: Connector;
  output: Connector;
};

export type Metadata = {
  xPos: number;
  yPos: number;
};

export type Graph = {
  nodes: Node[];
  connections: Connection[];
  metadata: Record<string, Metadata>;
};

export type Flow = {
  _id: string;
  name: string;
  author_id: string;
  description: string;
  graph: Graph;
};

export const NODE_TYPE_REGISTRY: Record<string, NodeType> = {};

export function loadNodeTypes(types: NodeType[]) {
  for (const type of types) {
    NODE_TYPE_REGISTRY[type.name] = type;
  }
}

export const SAMPLE_FLOW_DATA: Flow = {
  _id: "269e8442-05b9-4981-a9cb-c780a42cba30",
  name: "Test Flow",
  description: "This is a test flow",
  author_id: "166d8840-322d-4d9e-9967-cb5be6d49af2",
  graph: {
    nodes: [
      {
        id: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
        type: "test_start",
        settings: {
          setting: {
            type: "number",
            value: 0.0,
          },
        },
        inputTypes: {},
      },
      {
        id: "6f8de627-706d-4817-8921-73bff23006a8",
        type: "test_process",
        settings: {
          setting: {
            type: "list$number",
            value: [20.0, 3.0],
          },
        },
        inputTypes: {
          process_input: "number",
        },
      },
      {
        id: "b15f484f-4345-4f30-9162-5210b4ff1433",
        type: "test_end",
        settings: {
          setting: {
            type: "optional$number",
            value: {
              present: true,
              value: 1.5,
            },
          },
        },
        inputTypes: {
          end_input: "number",
        },
      },
    ],
    connections: [
      {
        output: {
          nodeId: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
          name: "start_output",
          type: "number",
        },
        input: {
          nodeId: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "process_input",
          type: "number",
        },
      },
      {
        output: {
          nodeId: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "process_output",
          type: "number",
        },
        input: {
          nodeId: "b15f484f-4345-4f30-9162-5210b4ff1433",
          name: "end_input",
          type: "number",
        },
      },
    ],
    metadata: {
      "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd": {
        xPos: 1.0,
        yPos: 0.0,
      },
    },
  },
};
