import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";

import {
  Accessor,
  createContext,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";

import {
  Start_Node,
  Action_Node,
  Variable_Node,
  End_Node,
} from "~/components/nodes/Node";

import { movable } from "~/components/editor/directives/movable";
import { CanvasContext } from "~/components/editor/context";
import { grabSource } from "~/components/editor/directives/grabSource";
import { dropZone } from "~/components/editor/directives/dropZone";

/**
 * typescript will prune these if not referenced
 */
movable;
grabSource;
dropZone;

type DataTypes = "integer" | "boolean" | "string" | "optional" | "list";

type DataType<T extends DataTypes> = {
  type: T;
};

type NodeConnector<T extends DataTypes> = {
  nodeId: string;
  name: string;
  dataType: DataType<T>;
};

type NodeConnection<T extends DataTypes> = {
  from: NodeConnector<T>;
  to: NodeConnector<T>;
};

type NodeMetadata = {
  xPos: number;
  yPos: number;
};

type Node = {
  id: string;
  type: any;
  settings: Record<string, any>;
  inputs: Record<string, NodeConnector<DataTypes>>;
  outputs: Record<string, NodeConnector<DataTypes>>;
};

type Graph = {
  nodes: Record<string, Node>;
  connections: NodeConnection<DataTypes>[];
  metadataByNode: Record<string, NodeMetadata>;
};

export default function Home() {
  const [graph, updateGraph] = createStore<Graph>({
    nodes: {
      "001": {
        id: "001",
        type: "Input",
        settings: {},
        inputs: {},
        outputs: {},
      },
      "002": {
        id: "002",
        type: "Process",
        settings: {},
        inputs: {},
        outputs: {},
      },
      "003": {
        id: "003",
        type: "Process",
        settings: {},
        inputs: {},
        outputs: {},
      },
      "004": {
        id: "004",
        type: "Output",
        settings: {},
        inputs: {},
        outputs: {},
      },
    },
    connections: [],
    metadataByNode: {
      "001": {
        xPos: 50,
        yPos: 350,
      },
      "002": {
        xPos: 400,
        yPos: 350,
      },
      "003": {
        xPos: 750,
        yPos: 350,
      },
      "004": {
        xPos: 250,
        yPos: 650,
      },
    },
  });

  const [moving, setMoving] = createSignal<{ id: string } | undefined>(
    undefined
  ); // => T
  const [grabbed, setGrabbed] = createSignal<string | undefined>(undefined);

  const [virtualX, setVX] = createSignal(350);
  const [virtualY, setVY] = createSignal(100);

  let zoomRef: Accessor<number> | undefined;

  // => prop
  function handleMove<T extends { id: string }>(
    ref: T,
    [movementX, movementY]: [number, number]
  ) {
    updateGraph("metadataByNode", ref.id, "xPos", (x) => x + movementX);
    updateGraph("metadataByNode", ref.id, "yPos", (y) => y + movementY);
  }

  return (
    <main
      class={styles.container}
      onMouseMove={(e) => {
        if (moving()) {
          handleMove(moving()!, [
            e.movementX / zoomRef!(),
            e.movementY / zoomRef!(),
          ]);
        }

        if (grabbed()) {
          setVX(e.clientX);
          setVY(e.clientY);
        }
      }}
      onMouseUp={(ev) => {
        if (moving()) {
          setMoving(undefined);
        }

        if (grabbed()) {
          setGrabbed(undefined);
          setVX(350);
          setVY(100);

          const els = document.querySelectorAll("svg > *");
          // TODO: optimisation: search at and below top element below cursor "elementsFromPoint"
          for (const el of els) {
            const droppable = el.querySelector("[data-drop-zone]");
            if (droppable) {
              const pos = droppable.getBoundingClientRect();
              if (
                ev.clientX > pos.left &&
                ev.clientX < pos.right &&
                ev.clientY > pos.top &&
                ev.clientY < pos.bottom
              ) {
                const id = droppable.getAttribute("data-drop-zone")!;
                updateGraph("connections", [
                  ...graph.connections,
                  {
                    from: {
                      nodeId: "001",
                      name: "test",
                      dataType: {
                        type: "string",
                      },
                    },
                    to: {
                      nodeId: id,
                      name: "test",
                      dataType: {
                        type: "string",
                      },
                    },
                  },
                ]);
              }
            }
          }
        }
      }}
    >
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
      <CanvasContext.Provider
        value={{
          setMoving,
          setGrabbed(ref, virtualX, virtualY) {
            setGrabbed(ref);
            setVX(virtualX);
            setVY(virtualY);
          },
        }}
      >
        <div class={styles.sidebar}>
          <div
            use:grabSource="i am some data"
            style="background: #eb6e6e; border-radius: 16px; padding: 4px"
          >
            variable
          </div>
        </div>
        <Canvas class={styles.canvas} zoomRef={(ref) => (zoomRef = ref)}>
          <For each={Object.keys(graph.nodes)}>
            {(id) => {
              const node = graph.nodes[id];
              const metadata = graph.metadataByNode[id];
              const connections = () =>
                graph.connections.filter((x) => x.to.nodeId === id);

              return (
                <CanvasElement
                  x={metadata.xPos}
                  y={metadata.yPos}
                  width={node.type === "Process" ? 288 : 256}
                  height={200}
                >
                  <div use:movable={{ id }}>
                    <Switch>
                      <Match when={node.type === "Input"}>
                        <Start_Node />
                        <div use:grabSource="i am some data">
                          <Variable_Node />
                        </div>
                      </Match>
                      <Match when={node.type === "Process"}>
                        <Action_Node>
                          <div
                            use:dropZone={id}
                            style="color: white; min-height: 50px"
                          >
                            <Switch fallback={"drop variables here"}>
                              <Match when={connections().length}>
                                <For each={connections()}>
                                  {() => <Variable_Node />}
                                </For>
                              </Match>
                            </Switch>
                          </div>
                        </Action_Node>
                      </Match>
                      <Match when={node.type === "Output"}>
                        <End_Node />
                      </Match>
                    </Switch>
                  </div>
                </CanvasElement>
              );
            }}
          </For>

          <For each={graph.connections}>
            {(connection, index) => (
              <text
                x={graph.metadataByNode[connection.from.nodeId].xPos}
                y={
                  graph.metadataByNode[connection.from.nodeId].yPos +
                  180 +
                  index() * 20
                }
                textContent={`draw line connection to ${connection.to.nodeId}`}
                fill="white"
              />
            )}
          </For>

          <Show when={grabbed()}>
            <Portal>
              <div
                style={{
                  position: "fixed",
                  left: virtualX() + "px",
                  top: virtualY() + "px",
                  transform: "translate(-50%, -50%) rotateZ(-3deg)",
                }}
              >
                <Variable_Node />
              </div>
            </Portal>
          </Show>
        </Canvas>
      </CanvasContext.Provider>
    </main>
  );
}
