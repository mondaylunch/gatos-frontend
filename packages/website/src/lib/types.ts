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
