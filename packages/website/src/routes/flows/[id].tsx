import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";

import { Accessor, createSignal, For, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { PortalAbove } from "~/components/editor/PortalAbove";

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

  const [move, setMove] = createSignal(false);
  const [grabbed, setGrabbed] = createSignal<string | undefined>(undefined);
  const [x, setX] = createSignal(100);
  const [y, setY] = createSignal(100);
  const [virtualX, setVX] = createSignal(350);
  const [virtualY, setVY] = createSignal(100);
  const [dropped, setDropped] = createSignal([] as number[]);

  let zoomRef: Accessor<number> | undefined;
  let transformRef:
    | ((clientCoords: [number, number]) => [number, number])
    | undefined;

  function variableSource(el: HTMLElement, variable: Accessor<any>) {
    function grab(ev: MouseEvent) {
      setGrabbed(variable());
      const [x, y] = transformRef!([ev.clientX, ev.clientY]);
      setVX(x);
      setVY(y);
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
          setX((x) => x + e.movementX / zoomRef!());
          setY((y) => y + e.movementY / zoomRef!());
        }

        if (grabbed()) {
          const [x, y] = transformRef!([e.clientX, e.clientY]);
          setVX(x);
          setVY(y);
        }
      }}
      onMouseUp={(ev) => {
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

        <CanvasElement x={x()} y={y()} width={200} height={200}>
          <div
            style="background: gray"
            onMouseDown={() => setMove(true)}
            onMouseUp={() => setMove(false)}
          >
            text
            <div
              style="background: black; color: white; width: 128px; height: 128px; display: flex; flex-wrap: wrap;"
              id="yes"
            >
              <Switch fallback={<>A</>}>
                <Match when={dropped().length}>
                  <For each={dropped()}>
                    {() => (
                      <div style="background: red; height: 48px;">var</div>
                    )}
                  </For>
                </Match>
              </Switch>
            </div>
          </div>
        </CanvasElement>
        <CanvasElement x={350} y={100} width={100} height={100}>
          <div style="background: red">arbitrary variable</div>
        </CanvasElement>
        <Show when={grabbed()}>
          <CanvasElement x={virtualX()} y={virtualY()} width={100} height={100}>
            <PortalAbove centre>
              <div style="background: red">{grabbed()}</div>
            </PortalAbove>
          </CanvasElement>
        </Show>
      </Canvas>
    </main>
  );
}
