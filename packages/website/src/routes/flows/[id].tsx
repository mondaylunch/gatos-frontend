import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";

import { Accessor, createSignal, For, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";

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
    },
    connections: [],
    metadataByNode: {
      "001": {
        xPos: 150,
        yPos: 350,
      },
      "002": {
        xPos: 400,
        yPos: 350,
      },
      "003": {
        xPos: 650,
        yPos: 350,
      },
    },
  });

  const [move, setMove] = createSignal<string | undefined>(undefined);
  const [grabbed, setGrabbed] = createSignal<string | undefined>(undefined);

  const [virtualX, setVX] = createSignal(350);
  const [virtualY, setVY] = createSignal(100);

  let zoomRef: Accessor<number> | undefined;
  let transformRef:
    | ((clientCoords: [number, number]) => [number, number])
    | undefined;

  function variableSource(el: HTMLElement, variable: Accessor<any>) {
    function grab(ev: MouseEvent) {
      ev.stopPropagation();

      setGrabbed(variable());
      setVX(ev.clientX);
      setVY(ev.clientY);
    }

    el.addEventListener("mousedown", grab);
    return () => el.removeEventListener("mousedown", grab);
  }

  function variableDropZone(el: HTMLElement, nodeId: Accessor<string>) {
    el.setAttribute("data-accept-variable", nodeId());
  }

  return (
    <main
      class={styles.container}
      onMouseMove={(e) => {
        if (move()) {
          updateGraph(
            "metadataByNode",
            move()!,
            "xPos",
            (x) => x + e.movementX / zoomRef!()
          );

          updateGraph(
            "metadataByNode",
            move()!,
            "yPos",
            (y) => y + e.movementY / zoomRef!()
          );
        }

        if (grabbed()) {
          setVX(e.clientX);
          setVY(e.clientY);
        }
      }}
      onMouseUp={(ev) => {
        if (move()) {
          setMove(undefined);
        }

        if (grabbed()) {
          setGrabbed(undefined);
          setVX(350);
          setVY(100);

          const els = document.querySelectorAll("svg > *");
          // TODO: optimisation: search at and below top element below cursor "elementsFromPoint"
          for (const el of els) {
            const droppable = el.querySelector("[data-accept-variable]");
            if (droppable) {
              const pos = droppable.getBoundingClientRect();
              if (
                ev.clientX > pos.left &&
                ev.clientX < pos.right &&
                ev.clientY > pos.top &&
                ev.clientY < pos.bottom
              ) {
                const id = droppable.getAttribute("data-accept-variable")!;
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
                // setDropped((x) => [...x, 0]);
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
      <div class={styles.sidebar}>
        <div
          use:variableSource="i am some data"
          style="background: #eb6e6e; border-radius: 16px; padding: 4px"
        >
          variable
        </div>
      </div>
      <Canvas
        class={styles.canvas}
        zoomRef={(ref) => (zoomRef = ref)}
        transformRef={(ref) => (transformRef = ref)}
      >
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
                width={200}
                height={200}
                onMouseDown={() => setMove(id)}
              >
                <Switch>
                  <Match when={node.type === "Input"}>
                    <div style="background: gray">
                      i am a node
                      <div
                        use:variableSource="i am some data"
                        style="background: #eb6e6e; border-radius: 16px; padding: 4px"
                      >
                        variable
                      </div>
                    </div>
                  </Match>
                  <Match when={node.type === "Process"}>
                    <div style="background: gray">
                      i do something with:
                      <div
                        use:variableDropZone={id}
                        style="background: black; color: white; min-height: 50px"
                      >
                        <Switch fallback={"drop variables here"}>
                          <Match when={connections().length}>
                            <For each={connections()}>
                              {() => <div style="background: red;">var</div>}
                            </For>
                          </Match>
                        </Switch>
                      </div>
                    </div>
                  </Match>
                </Switch>
              </CanvasElement>
            );
          }}
        </For>

        <Show when={grabbed()}>
          <Portal>
            <div
              style={{
                position: "fixed",
                left: virtualX() - 50 + "px",
                top: virtualY() - 50 + "px",
                width: "100px",
                height: "100px",
                background: "red",
                transform: "rotateZ(-3deg)",
              }}
            >
              {grabbed()}
            </div>
          </Portal>
        </Show>
      </Canvas>
    </main>
  );
}
