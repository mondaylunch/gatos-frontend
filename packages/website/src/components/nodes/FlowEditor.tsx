import styles from "./editor.module.css";

import { createStore } from "solid-js/store";
import { Meta } from "solid-start";
import {
  DataType,
  Flow,
  Graph,
  loadNodeTypes,
  Metadata,
  Node,
  NodeType,
  SAMPLE_FLOW_DATA,
} from "~/lib/types";
import { VariableNode } from "./Node";
import { NodeSidebar } from "./NodeSidebar";
import { RenderConnections } from "./RenderConnections";
import { RenderNodes } from "./RenderNodes";
import { InteractiveCanvas } from "../editor/InteractiveCanvas";
import { SettingsSidebar } from "./SettingsSidebar";
import { createSignal, Match, onCleanup, Switch } from "solid-js";
import { ENDPOINT } from "~/lib/env";
import { user } from "~/lib/session";
import { NodeTypeDrag } from "~/components/editor/NodeTypeDrag";

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

type Grabbable =
  | {
      type: "NodeType";
      node: NodeType;
    }
  | {
      type: "Variable";
      id: string;
      name: string;
    };

type GraphAction =
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
      type: "DeleteNode";
      id: string;
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
  clearTimeout(__requestQueue[ns + id]);
  __requestQueue[ns + id] = setTimeout(fn, 1200) as never as number;
}

export function FlowEditor(props: { flow: Flow; nodeTypes: NodeType[] }) {
  loadNodeTypes(props.nodeTypes);
  const [graph, updateGraph] = createStore<Graph>(populate(props.flow.graph));
  const [selectedNode, setSelected] = createSignal<string>();

  /**
   * Debugging
   */
  if (typeof window !== "undefined") {
    loadNodeTypes([
      { name: "test_start", category: "input" },
      { name: "test_process", category: "process" },
      { name: "test_end", category: "output" },
    ]);

    (window as any).__setDebugGraph = () =>
      updateGraph(populate(SAMPLE_FLOW_DATA.graph));
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
    const res = fetch(`${ENDPOINT}/api/v1/flows/${props.flow._id}/${url}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        "X-Auth-Token": user()!.auth_token,
        "Content-Type": "application/json",
      },
    });

    return body ? await res.then((res) => res.json()) : undefined;
  }

  /**
   * Execute an action against the graph
   * @param action Action
   */
  async function executeAction(action: GraphAction) {
    switch (action.type) {
      case "CreateNode": {
        const node: Node = await sendRequest("POST", `graph/nodes`, {
          type: action.nodeType,
        });

        executeAction({
          type: "MoveNode",
          id: node.id,
          metadata: action.metadata,
        });

        updateGraph("nodes", (nodes) => [...nodes, node]);
        break;
      }
      case "MoveNode": {
        debounceRequest(action.id, "metadata", () =>
          sendRequest(
            "PATCH",
            `graph/nodes/${action.id}/metadata`,
            action.metadata
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

        await sendRequest("POST", `graph/connections`, {
          from_node_id: action.output.id,
          from_name: action.output.name,
          to_node_id: action.input.id,
          to_name: action.input.name,
        });

        break;
      }
      case "DeleteNode": {
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

        await sendRequest("DELETE", `graph/nodes/${action.id}`);
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
  function handleDrop(
    [x_pos, y_pos]: [number, number],
    ref: Grabbable,
    targetNodeId?: string
  ) {
    if (ref.type === "Variable" && targetNodeId) {
      const [type, nodeId, inputName] = targetNodeId.split(":");
      if (type === "node") {
        // Get the node we are connecting to
        const inputNode = graph.nodes.find((node) => node.id === nodeId)!;
        const outputNode = graph.nodes.find((node) => node.id === ref.id)!;

        // 1. If the input or output does not exist, reject.
        if (!inputNode || !outputNode) return;

        // 2. If the variable types differ, reject.
        const output = outputNode.outputs[ref.name];
        const input = inputNode.inputs[inputName];
        if (!output) throw `Output "${ref.name}" not defined in the node!`;
        if (!input) throw `Input "${inputName}" not defined in the node!`;
        if (output.type !== input.type && input.type !== "any") return;

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
          <VariableNode name={(ref as Grabbable & { type: "Variable" }).id} />
        </Match>
        <Match when={ref.type === "NodeType"}>
          <NodeTypeDrag
            name={(ref as Grabbable & { type: "NodeType" }).node.name}
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
      postCanvas={<SettingsSidebar />}
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
