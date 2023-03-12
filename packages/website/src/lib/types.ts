export type User = {
  avatar: string | undefined;
  username: string;
  email: string;
};

export type NodeType = {
  name: string;
  category: "start" | "process" | "end";
};

export type DataType =
  | "any"
  | "number"
  | "optional"
  | `optional$${string}`
  | `list$${string}`;

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
    }
  | {
      type: "boolean";
      value: boolean;
    }
  | {
      type: "string";
      value: string;
    };

export type IO = {
  node_id: string;
  name: string;
  type: DataType;
};

export type Node = {
  id: string;
  type: string;
  settings: Record<string, Setting>;
  inputs: Record<string, IO>;
  outputs: Record<string, IO>;
};

export type Connector = {
  node_id: string;
  name: string;
  type: DataType;
};

export type Connection = {
  input: Connector;
  output: Connector;
};

export type Metadata = {
  x_pos: number;
  y_pos: number;
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
        inputs: {},
        outputs: {
          start_output: {
            node_id: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
            name: "start_output",
            type: "number",
          },
        },
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
        inputs: {
          process_input: {
            node_id: "6f8de627-706d-4817-8921-73bff23006a8",
            name: "process_input",
            type: "number",
          },
        },
        outputs: {
          process_output: {
            node_id: "6f8de627-706d-4817-8921-73bff23006a8",
            name: "process_output",
            type: "number",
          },
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
        inputs: {
          end_input: {
            node_id: "b15f484f-4345-4f30-9162-5210b4ff1433",
            name: "end_input",
            type: "number",
          },
        },
        outputs: {},
      },
    ],
    connections: [
      {
        output: {
          node_id: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
          name: "start_output",
          type: "number",
        },
        input: {
          node_id: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "process_input",
          type: "number",
        },
      },
      {
        output: {
          node_id: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "process_output",
          type: "number",
        },
        input: {
          node_id: "b15f484f-4345-4f30-9162-5210b4ff1433",
          name: "end_input",
          type: "number",
        },
      },
    ],
    metadata: {
      "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd": {
        x_pos: 1.0,
        y_pos: 0.0,
      },
    },
  },
};
