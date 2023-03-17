import styles from "./editor.module.css";

import { createStore } from "solid-js/store";
import { Meta } from "solid-start";
import {
  DataType,
  Flow,
  Graph,
  loadNodeTypes,
  Metadata,
  NodeType,
  GraphChanges,
  Connection,
  Connector,
} from "~/lib/types";
import { VariableNode } from "./Node";
import { NodeSidebar } from "./NodeSidebar";
import { RenderConnections } from "./RenderConnections";
import { RenderNodes } from "./RenderNodes";
import { InteractiveCanvas } from "../editor/InteractiveCanvas";
import { SettingsSidebar } from "./SettingsSidebar";
import { createSignal, Match, onCleanup, Switch } from "solid-js";
import { NodeTypeDrag } from "~/components/editor/NodeTypeDrag";
import { createBackendFetchAction } from "~/lib/backend";
import isEqual from "lodash.isequal";
import pickBy from "lodash.pickby";

/**
 * Populate Graph with missing metadata
 * @param graph Graph
 * @returns Populated Graph
 */
function populate(
  graph: Graph = { connections: [], metadata: {}, nodes: [] }
): Graph {
  const metadata = { ...graph.metadata };
  for (const node of graph.nodes) {
    metadata[node.id] = {
      x_pos: 0,
      y_pos: 0,
      ...(metadata[node.id] as any),
    };
  }

  return {
    ...graph,
    metadata,
  };
}

// Check if two connections are equal
const compareKeys = new Set(["node_id", "name"]);
const hasKey = (_: never, key: string) => compareKeys.has(key);
const connectorEqual = (a: Connector, b: Connector) =>
  isEqual(pickBy(a, hasKey), pickBy(b, hasKey));
export const connectionsEqual = (a: Connection, b: Connection) =>
  connectorEqual(a.input, b.input) && connectorEqual(a.output, b.output);

export type Grabbable =
  | {
      type: "NodeType";
      node: NodeType;
    }
  | {
      type: "Variable";
      id: string;
      name: string;
    }
  | {
      type: "ExistingConnection";
      connector: Connector;
      currentZone: string;
    };

export type GraphAction =
  | {
      type: "CreateNode";
      nodeType: string;
      metadata: Metadata;
    }
  | {
      type: "MoveNode";
      id: string;
      metadata: Metadata;
    }
  | {
      type: "ConnectNode";
      input: {
        id: string;
        name: string;
      };
      output: {
        id: string;
        name: string;
      };
      dataType: DataType;
    }
  | {
      type: "DisconnectNode";
      connection: Connection;
    }
  | {
      type: "DeleteNode";
      id: string;
    }
  | {
      type: "UpdateSettingsKey";
      id: string;
      key: string;
      value: any;
    };

/**
 * Debounce requests to the server
 */
const __requestQueue: Record<string, number> = {};

/**
 * Debounce an action to the server
 * @param id Node ID
 * @param ns Namespace
 * @param fn Function
 */
function debounceRequest(id: string, ns: string, fn: () => void) {
  clearTimeout(__requestQueue[id + ns]);
  __requestQueue[id + ns] = setTimeout(() => {
    fn();
    delete __requestQueue[id + ns];
  }, 1200) as never as number;
}

/**
 * Clear requests for a given ID
 * @param id Node ID
 */
function clearRequests(id: string) {
  Object.keys(__requestQueue)
    .filter((key) => key.startsWith(id))
    .forEach((key) => {
      clearTimeout(__requestQueue[key]);
      delete __requestQueue[key];
    });
}

export function FlowEditor(props: { flow: Flow; nodeTypes: NodeType[] }) {
  loadNodeTypes(props.nodeTypes);
  const [graph, updateGraph] = createStore<Graph>(populate(props.flow.graph));
  const [selectedNode, setSelected] = createSignal<string>();
  const [_, sendBackendRequest] = createBackendFetchAction();

  function applyChanges(changes: GraphChanges) {
    console.info(changes);

    // Remove connections
    for (const connection of changes.removed_connections) {
      updateGraph("connections", (connections) =>
        connections.filter((entry) => !connectionsEqual(connection, entry))
      );
    }

    // Remove nodes
    for (const node_id of changes.removed_nodes) {
      updateGraph("nodes", (nodes) =>
        nodes.filter((node) => node.id !== node_id)
      );
    }

    // Add metadata
    for (const node_id of Object.keys(changes.added_metadata)) {
      updateGraph("metadata", node_id, changes.added_metadata[node_id]);
    }

    // Add nodes
    for (const node of changes.added_nodes) {
      updateGraph("nodes", (nodes) => {
        // Try to edit the node "in-place"
        let found = false;
        const newList = nodes.map((entry) => {
          if (entry.id === node.id) {
            found = true;
            return node;
          }

          return entry;
        });

        return found ? newList : [...newList, node];
      });
    }

    // Add connections
    for (const connection of changes.added_connections) {
      updateGraph("connections", (connections) => {
        // Try to edit the connection "in-place"
        let found = false;
        const newList = connections.map((entry) => {
          if (connectionsEqual(connection, entry)) {
            found = true;
            return connection;
          }

          return entry;
        });

        return found ? newList : [...newList, connection];
      });
    }

    // We do not remove metadata from the client because we don't need to
  }

  /**
   * Send a request
   * @param method Method request
   * @param url Request URL
   * @param body Request body stringified as JSON
   * @returns T
   */
  async function sendRequest<T>(
    method: string,
    url: string,
    body?: any
  ): Promise<T> {
    const res = sendBackendRequest({
      route: `/api/v1/flows/${props.flow._id}/${url}`,
      init: {
        method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    return await res.then((res) =>
      res.ok
        ? res.json()
        : res.json().then((res) => {
            throw res;
          })
    );
  }

  /**
   * Execute an action against the graph
   * @param action Action
   */
  async function executeAction(action: GraphAction) {
    switch (action.type) {
      case "CreateNode": {
        const changes: GraphChanges = await sendRequest("POST", `nodes`, {
          type: action.nodeType,
        });

        applyChanges(changes);

        const node = changes.added_nodes[0];
        if (node) {
          executeAction({
            type: "MoveNode",
            id: node.id,
            metadata: action.metadata,
          });
        }

        break;
      }
      case "MoveNode": {
        debounceRequest(action.id, "metadata", async () =>
          applyChanges(
            await sendRequest(
              "PATCH",
              `nodes/${action.id}/metadata`,
              action.metadata
            )
          )
        );

        updateGraph("metadata", action.id, action.metadata);

        break;
      }
      case "ConnectNode": {
        updateGraph("connections", [
          ...graph.connections,
          {
            output: {
              node_id: action.output.id,
              name: action.output.name,
              type: action.dataType,
            },
            input: {
              node_id: action.input.id,
              name: action.input.name,
              type: action.dataType,
            },
          },
        ]);

        applyChanges(
          await sendRequest("POST", `connections`, {
            from_node_id: action.output.id,
            from_name: action.output.name,
            to_node_id: action.input.id,
            to_name: action.input.name,
          })
        );

        break;
      }
      case "DisconnectNode": {
        updateGraph("connections", (connections) =>
          connections.filter(
            (connection) => !connectionsEqual(connection, action.connection)
          )
        );

        applyChanges(
          await sendRequest("DELETE", `connections`, {
            from_node_id: action.connection.output.node_id,
            from_name: action.connection.output.name,
            to_node_id: action.connection.input.node_id,
            to_name: action.connection.input.name,
          })
        );

        break;
      }
      case "DeleteNode": {
        clearRequests(action.id);

        updateGraph("connections", (connections) =>
          connections.filter(
            (connection) =>
              connection.input.node_id !== action.id &&
              connection.output.node_id !== action.id
          )
        );

        updateGraph("nodes", (nodes) =>
          nodes.filter((node) => node.id !== action.id)
        );

        applyChanges(await sendRequest("DELETE", `nodes/${action.id}`));

        break;
      }
      case "UpdateSettingsKey": {
        const existingNode = graph.nodes.find((node) => node.id === action.id)!;
        applyChanges(
          await sendRequest("PATCH", `nodes/${action.id}/settings`, {
            [action.key]: {
              ...existingNode.settings[action.key],
              value: action.value,
            },
          })
        );

        break;
      }
    }
  }

  /**
   * Handle move events from canvas
   * @param ref Reference object
   * @param param1 Movement information
   */
  function handleMove(
    ref: { id: string },
    [movementX, movementY]: [number, number]
  ) {
    const metadata = graph.metadata[ref.id];
    executeAction({
      type: "MoveNode",
      id: ref.id,
      metadata: {
        x_pos: metadata.x_pos + movementX,
        y_pos: metadata.y_pos + movementY,
      },
    });
  }

  /**
   * Handle drop event from canvas
   * @param param1 Position of dropped element
   * @param ref Reference object
   * @param targetNodeId Target drop zone
   */
  async function handleDrop(
    [x_pos, y_pos]: [number, number],
    ref: Grabbable,
    targetNodeId?: string
  ) {
    if (ref.type === "ExistingConnection") {
      // If the connection hasn't changed, just ignore.
      if (targetNodeId === ref.currentZone) return;
      const [_, nodeId, inputName] = ref.currentZone.split(":");

      // Remove the current connection:
      executeAction({
        type: "DisconnectNode",
        connection: {
          input: {
            name: inputName,
            node_id: nodeId,
          } as Connector,
          output: ref.connector,
        },
      });

      // Setup the new connection, if applicable.
      handleDrop(
        [x_pos, y_pos],
        {
          type: "Variable",
          id: ref.connector.node_id,
          name: ref.connector.name,
        },
        targetNodeId
      );
    }

    if (ref.type === "Variable" && targetNodeId) {
      const [type, nodeId, inputName] = targetNodeId.split(":");
      if (type === "node") {
        // Get the node we are connecting to:
        const inputNode = graph.nodes.find((node) => node.id === nodeId)!;
        const outputNode = graph.nodes.find((node) => node.id === ref.id)!;

        // 1. If the input or output does not exist, reject.
        if (!inputNode || !outputNode) return;

        // 2. If the variable types differ, reject.
        const output = outputNode.outputs[ref.name];
        const input = inputNode.inputs[inputName];
        if (!output) throw `Output "${ref.name}" not defined in the node!`;
        if (!input) throw `Input "${inputName}" not defined in the node!`;
        if (
          output.type !== input.type &&
          input.type !== "any" &&
          output.type !== "any" &&
          !(input.type === "optional" && output.type.startsWith("optional"))
        )
          return;

        // 3. If an input connection already exists, reject.
        if (
          graph.connections.find(
            (connection) =>
              connection.input.node_id === nodeId &&
              connection.input.name === inputName
          )
        )
          return console.info("Ignoring duplicate connection to input.");

        // Connect the two sides
        executeAction({
          type: "ConnectNode",
          output: {
            id: ref.id,
            name: ref.name,
          },
          input: {
            id: nodeId,
            name: inputName,
          },
          dataType: output.type,
        });
      }
    }

    if (ref.type === "NodeType") {
      executeAction({
        type: "CreateNode",
        nodeType: ref.node.name,
        metadata: {
          x_pos,
          y_pos,
        },
      });
    }
  }

  /**
   * Handle key press for deleting selected node
   * @param event Keyboard Event
   */
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Delete") {
      event.preventDefault();

      const id = selectedNode();
      console.info("selected:", id);
      if (id) {
        executeAction({
          type: "DeleteNode",
          id,
        });
      }
    }
  }

  if (typeof window !== "undefined") {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  }

  /**
   * Render virtual grabbed element
   * @param ref Object reference
   */
  function renderVirtualElement(ref: Grabbable) {
    return (
      <Switch>
        <Match when={ref.type === "Variable"}>
          <VariableNode
            name={(ref as Grabbable & { type: "Variable" }).name}
            id={(ref as Grabbable & { type: "Variable" }).id}
          />
        </Match>
        <Match when={ref.type === "ExistingConnection"}>
          <VariableNode
            name={
              (ref as Grabbable & { type: "ExistingConnection" }).connector.name
            }
            id={
              (ref as Grabbable & { type: "ExistingConnection" }).connector
                .node_id
            }
          />
        </Match>
        <Match when={ref.type === "NodeType"}>
          <NodeTypeDrag
            name={(ref as Grabbable & { type: "NodeType" }).node.name}
            displayName={
              (ref as Grabbable & { type: "NodeType" }).node.displayName
            }
          />
        </Match>
      </Switch>
    );
  }

  return (
    <InteractiveCanvas
      containerProps={{
        class: styles.container,
      }}
      canvasProps={{
        class: styles.canvas,
      }}
      preCanvas={
        <>
          <Meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
          <NodeSidebar />
        </>
      }
      postCanvas={<SettingsSidebar graph={graph} updateGraph={executeAction} />}
      handleMove={handleMove}
      handleDrop={handleDrop}
      handleSelect={setSelected}
      renderVirtualElement={renderVirtualElement}
    >
      <RenderConnections graph={graph} />
      <RenderNodes graph={graph} />
    </InteractiveCanvas>
  );
}
