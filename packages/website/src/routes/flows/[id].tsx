import { Meta } from "solid-start";
import styles from "./editor.module.css";

import { createStore } from "solid-js/store";

import { VariableNode } from "~/components/nodes/Node";

import { movable } from "~/components/editor/directives/movable";
import { grabSource } from "~/components/editor/directives/grabSource";
import { dropZone } from "~/components/editor/directives/dropZone";
import { InteractiveCanvas } from "~/components/editor/InteractiveCanvas";
import { Graph, SAMPLE_FLOW_DATA } from "~/lib/types";
import { RenderNodes } from "~/components/nodes/RenderNodes";
import { RenderConnections } from "~/components/nodes/RenderConnections";
import { NodeSidebar } from "~/components/nodes/NodeSidebar";

/**
 * typescript will prune these if not referenced
 */
movable;
grabSource;
dropZone;

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
  function handleDrop(ref: { id: string }, targetNodeId: string) {
    updateGraph("connections", [
      ...graph.connections,
      {
        output: {
          nodeId: ref.id,
          name: "test",
          type: "integer",
        },
        input: {
          nodeId: targetNodeId,
          name: "test",
          type: "integer",
        },
      },
    ]);
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
