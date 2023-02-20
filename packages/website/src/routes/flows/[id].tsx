import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import styles from "./editor.module.css";

import { For, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";

import {
  InputNode,
  OutputNode,
  ProcessNode,
  VariableDropZone,
  VariableNode,
} from "~/components/nodes/Node";

import { movable } from "~/components/editor/directives/movable";
import { grabSource } from "~/components/editor/directives/grabSource";
import { dropZone } from "~/components/editor/directives/dropZone";
import { InteractiveCanvas } from "~/components/editor/InteractiveCanvas";
import { Graph, Metadata, SAMPLE_FLOW_DATA } from "~/lib/types";

/**
 * typescript will prune these if not referenced
 */
movable;
grabSource;
dropZone;

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

  function getMetadata(id: string): Metadata {
    return (
      graph.metadata[id] ?? {
        xPos: 0,
        yPos: 0,
      }
    );
  }

  function handleMove(
    ref: { id: string },
    [movementX, movementY]: [number, number]
  ) {
    updateGraph("metadata", ref.id, "xPos", (x) => x + movementX);
    updateGraph("metadata", ref.id, "yPos", (y) => y + movementY);
  }

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
          <div class={styles.sidebar}>
            <div
              use:grabSource="i am some data"
              style="background: #eb6e6e; border-radius: 16px; padding: 4px"
            >
              variable
            </div>
          </div>
        </>
      }
      handleMove={handleMove}
      handleDrop={handleDrop}
      renderVirtualElement={renderVirtualElement}
    >
      <For each={graph.nodes}>
        {(node) => {
          const metadata = getMetadata(node.id);
          const connections = () =>
            graph.connections.filter((x) => x.input.nodeId === node.id);

          return (
            <CanvasElement x={metadata.xPos} y={metadata.yPos}>
              <div use:movable={{ id: node.id }}>
                <Switch>
                  <Match when={node.type === "test_start"}>
                    <InputNode title="Integer Input" />
                    <div use:grabSource={{ id: node.id }}>
                      <VariableNode name="sus" />
                    </div>
                  </Match>
                  <Match when={node.type === "test_process"}>
                    <ProcessNode title="sus">
                      <VariableDropZone>
                        <div use:dropZone={node.id}>
                          <Switch fallback={"drop variables here"}>
                            <Match when={connections().length}>
                              <For each={connections()}>
                                {() => <VariableNode name="sus" />}
                              </For>
                            </Match>
                          </Switch>
                        </div>
                      </VariableDropZone>
                    </ProcessNode>
                  </Match>
                  <Match when={node.type === "test_end"}>
                    <OutputNode title="Integer Output" />
                  </Match>
                </Switch>
              </div>
            </CanvasElement>
          );
        }}
      </For>
      <For each={graph.connections}>
        {(connection, index) => {
          const outputMetadata = getMetadata(connection.output.nodeId);

          return (
            <text
              x={outputMetadata.xPos}
              y={outputMetadata.yPos + 180 + index() * 20}
              textContent={`draw line connection to ${connection.input.nodeId}`}
              fill="white"
            />
          );
        }}
      </For>
    </InteractiveCanvas>
  );
}
