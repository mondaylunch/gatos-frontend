import { Meta } from "solid-start";
import styles from "./editor.module.css";

import { createStore } from "solid-js/store";

import { VariableNode } from "~/components/nodes/Node";

import { InteractiveCanvas } from "~/components/editor/InteractiveCanvas";
import { Graph, NODE_TYPES, SAMPLE_FLOW_DATA } from "~/lib/types";
import { RenderNodes } from "~/components/nodes/RenderNodes";
import { RenderConnections } from "~/components/nodes/RenderConnections";
import { NodeSidebar } from "~/components/nodes/NodeSidebar";

/**
 * Populate Graph with missing metadata
 * @param graph Graph
 * @returns Populated Graph
 */
function populate(graph: Graph): Graph {
  const metadata = { ...graph.metadata };
  for (const node of graph.nodes) {
    if (!metadata[node.id]) {
      metadata[node.id] = {
        xPos: 0,
        yPos: 0,
      };
    }
  }

  return {
    ...graph,
    metadata,
  };
}

export default function FlowEditor() {
  const [graph, updateGraph] = createStore<Graph>(
    populate(SAMPLE_FLOW_DATA.graph)
  );

  /**
   * Handle move events from canvas
   * @param ref Reference object
   * @param param1 Movement information
   */
  function handleMove(
    ref: { id: string },
    [movementX, movementY]: [number, number]
  ) {
    updateGraph("metadata", ref.id, "xPos", (x) => x + movementX);
    updateGraph("metadata", ref.id, "yPos", (y) => y + movementY);
  }

  /**
   * Handle drop event from canvas
   * @param ref Reference object
   * @param targetNodeId Target drop zone
   */
  function handleDrop(ref: { id: string; name: string }, targetNodeId: string) {
    const [type, nodeId, inputName] = targetNodeId.split(":");

    if (type === "node") {
      // Get the node we are connecting to
      const inputNode = graph.nodes.find((node) => node.id === nodeId)!;

      // Get node types of both nodes involved
      const outputNodeType =
        NODE_TYPES[
          graph.nodes.find((node) => node.id === ref.id)
            ?.type as keyof typeof NODE_TYPES
        ];
      const inputNodeType =
        NODE_TYPES[inputNode.type as keyof typeof NODE_TYPES];

      // 1. If the input does not exist, reject.
      if (!inputNodeType) return;

      // 2. If the variable types differ, reject.
      const output = outputNodeType.outputs.find(
        (output) => output.name === ref.name
      )!;
      const inputType = inputNode.inputTypes[inputName];
      if (!output) throw `Output "${ref.name}" not registered in node types!`;
      if (!inputType) throw `Input "${inputName}" not defined in the node!`;
      if (output.type !== inputType) return;

      // 3. If an input connection already exists, reject.
      if (
        graph.connections.find(
          (connection) =>
            connection.input.nodeId === nodeId &&
            connection.input.name === inputName
        )
      )
        return console.info("Ignoring duplicate connection to input.");

      updateGraph("connections", [
        ...graph.connections,
        {
          output: {
            nodeId: ref.id,
            name: ref.name,
            type: output.type,
          },
          input: {
            nodeId: nodeId,
            name: inputName,
            type: inputType,
          },
        },
      ]);
    }
  }

  /**
   * Render virtual grabbed element
   * @param ref Object reference
   */
  function renderVirtualElement(ref: { id: string }) {
    return <VariableNode name={ref.id} />;
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
      handleMove={handleMove}
      handleDrop={handleDrop}
      renderVirtualElement={renderVirtualElement}
    >
      <RenderNodes graph={graph} />
      <RenderConnections graph={graph} />
    </InteractiveCanvas>
  );
}
