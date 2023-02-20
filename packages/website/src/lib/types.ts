export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  authToken: string;
};

export type Node = {
  id: string;
  type: string;
  settings: Record<string, string>;
};

export type Connector = {
  nodeId: string;
  name: string;
  type: "integer";
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

export const NODE_TYPES = {
  test_start: {
    name: "Start",
    inputs: [],
    outputs: [{ name: "out", type: "integer" }],
  },
  test_process: {
    name: "Process",
    inputs: [{ name: "in", type: "integer" }],
    outputs: [{ name: "out", type: "integer" }],
  },
  test_end: {
    name: "End",
    inputs: [{ name: "in", type: "integer" }],
    outputs: [],
  },
};

export const SAMPLE_FLOW_DATA: Flow = {
  _id: "269e8442-05b9-4981-a9cb-c780a42cba30",
  author_id: "166d8840-322d-4d9e-9967-cb5be6d49af2",
  description: "",
  graph: {
    nodes: [
      {
        id: "6f8de627-706d-4817-8921-73bff23006a8",
        type: "test_process",
        settings: {},
      },
      {
        id: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
        type: "test_start",
        settings: {},
      },
      {
        id: "b15f484f-4345-4f30-9162-5210b4ff1433",
        type: "test_end",
        settings: {},
      },
    ],
    connections: [
      {
        input: {
          nodeId: "b15f484f-4345-4f30-9162-5210b4ff1433",
          name: "in",
          type: "integer",
        },
        output: {
          nodeId: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "out",
          type: "integer",
        },
      },
      {
        input: {
          nodeId: "6f8de627-706d-4817-8921-73bff23006a8",
          name: "in",
          type: "integer",
        },
        output: {
          nodeId: "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd",
          name: "out",
          type: "integer",
        },
      },
    ],
    metadata: {
      "9f60cd6b-b4c2-43a1-83b7-711aa90ce8fd": {
        xPos: 100.0,
        yPos: 0.0,
      },
    },
  },
  name: "Test Flow",
};
