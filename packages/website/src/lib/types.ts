export type User = {
  avatar: string | undefined;
  username: string;
  email: string;
};

export type NodeType = {
  name: string;
  category: "start" | "process" | "end";
};

export type Widget =
  | {
      name: "textbox";
    }
  | {
      name: "textarea";
    }
  | {
      name: "numberbox";
    }
  | {
      name: "checkbox";
    }
  | {
      name: "dropdown";
      options: string[];
    };

export type DataTypeWithWidget = {
  name: string;
  widget: Widget;
};

export type Setting = {
  type: string;
  value: any;
};

export type IO = {
  node_id: string;
  name: string;
  type: string;
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
  type: string;
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

export type GraphChanges = {
  removed_nodes: string[];
  added_nodes: Node[];
  removed_connections: Connection[];
  added_connections: Connection[];
  removed_metadata: string[];
  added_metadata: Record<string, Metadata>;
};

export type SettingValues = Record<string, string[]>;

export type DisplayNames = Record<string, string>;
export const DISPLAY_NAMES: DisplayNames = {};

function loadDisplayNames(displayNames: DisplayNames) {
  for (const key in displayNames) {
    DISPLAY_NAMES[key] = displayNames[key];
  }
}

export function getDisplayName(type: string, key: string) {
  return DISPLAY_NAMES[`${type}.${key}`] || key;
}

export const NODE_TYPE_REGISTRY: Record<string, NodeType> = {};
export let SORTED_NODE_TYPES: NodeType[] = [];

function loadNodeTypes(types: NodeType[]) {
  for (const type of types) {
    NODE_TYPE_REGISTRY[type.name] = type;
  }
}

export const DATA_TYPE_WIDGET_REGISTRY: Record<string, Widget> = {};

function loadDataTypeWidgets(types: DataTypeWithWidget[]) {
  for (const type of types) {
    DATA_TYPE_WIDGET_REGISTRY[type.name] = type.widget;
  }
}

export function getWidget(typeName: string): Widget {
  return DATA_TYPE_WIDGET_REGISTRY[typeName] ?? "textbox";
}

export function loadDynamicData(
  types: NodeType[],
  displayNames: DisplayNames,
  widgets: DataTypeWithWidget[]
) {
  loadNodeTypes(types);
  loadDisplayNames(displayNames);
  loadDataTypeWidgets(widgets);

  SORTED_NODE_TYPES = [...types].sort((b, a) =>
    getDisplayName("node_type", b.name).localeCompare(
      getDisplayName("node_type", a.name)
    )
  );
}
