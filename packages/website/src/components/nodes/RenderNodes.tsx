import {
  Component,
  For,
  JSX,
  JSXElement,
  Match,
  Show,
  splitProps,
  Switch,
  useContext,
} from "solid-js";
import { Graph, NodeType, NODE_TYPE_REGISTRY } from "~/lib/types";

import { movable } from "../editor/directives/movable";
import { dropZone } from "../editor/directives/dropZone";
import { grabSource } from "../editor/directives/grabSource";
import { CanvasElement } from "../editor/CanvasElement";
import {
  InputNode,
  OutputNode,
  ProcessNode,
  VariableDropZone,
  VariableNode,
} from "./Node";
import { GrabbedSignalContext } from "../editor/InteractiveCanvas";
import { Grabbable } from "./FlowEditor";

movable;
dropZone;
grabSource;

/**
 * Pick the correct component to render
 */
function NodeTypeWrapper(props: {
  title: string;
  category: NodeType["category"];
  children: JSX.Element;
}) {
  const [local, remote] = splitProps(props, ["category"]);

  return (
    <Switch fallback={<ProcessNode {...remote} />}>
      <Match when={local.category === "start"}>
        <InputNode {...remote} />
      </Match>
      <Match when={local.category === "end"}>
        <OutputNode {...remote} />
      </Match>
    </Switch>
  );
}

/**
 * Render nodes within the graph
 */
export function RenderNodes(props: { graph: Graph }) {
  const grabbed = useContext(GrabbedSignalContext);

  return (
    <For each={props.graph.nodes}>
      {(node) => {
        // Resolve metadata for node
        const metadata = () =>
          props.graph.metadata[node.id] ?? {
            x_pos: 0,
            y_pos: 0,
          };

        // Resolve node type
        const nodeType = () =>
          NODE_TYPE_REGISTRY[node.type as keyof typeof NODE_TYPE_REGISTRY];

        return (
          <Show when={nodeType()}>
            <CanvasElement
              x={metadata().x_pos}
              y={metadata().y_pos}
              id={node.id}
            >
              {/** @ts-expect-error directives are not supported */}
              <div use:movable={{ id: node.id }}>
                <NodeTypeWrapper
                  title={nodeType().name}
                  category={nodeType().category}
                >
                  {/** Render each input drop zone */}
                  <For each={Object.keys(node.inputs)}>
                    {(inputName) => {
                      // Build current zone string
                      const currentZone = `node:${node.id}:${inputName}`;

                      // Find all connections for this node matching this input
                      const connections = () =>
                        props.graph.connections.filter(
                          (x) =>
                            x.input.node_id === node.id &&
                            x.input.name === inputName
                        );

                      // We can only have one connection per node so lets just pull it out
                      const connection = () => {
                        const connection = connections()[0];
                        if (!connection) return undefined;

                        // Hide the connection if it is currently grabbed
                        const ref = grabbed!() as Grabbable;
                        if (
                          ref?.type === "ExistingConnection" &&
                          ref.connector === connection.output &&
                          ref.currentZone === currentZone
                        ) {
                          return undefined;
                        }

                        return connection;
                      };

                      return (
                        <>
                          <Switch
                            fallback={
                              <div class="text-white font-medium capitalize">
                                {inputName}: {node.inputs[inputName].type}
                              </div>
                            }
                          >
                            <Match when={nodeType().category == "process"}>
                              <div class="text-black font-medium capitalize">
                                {inputName}: {node.inputs[inputName].type}
                              </div>
                            </Match>
                          </Switch>
                          <VariableDropZone>
                            {/** @ts-expect-error directives are not supported */}
                            <div use:dropZone={currentZone}>
                              <Switch fallback={"Drop variables here"}>
                                <Match when={connection()}>
                                  <div
                                    // @ts-expect-error directives are not supported
                                    use:grabSource={{
                                      type: "ExistingConnection",
                                      connector: connection()!.output,
                                      currentZone,
                                    }}
                                  >
                                    <VariableNode
                                      name={connection()!.output.name}
                                      id={connection()!.output.node_id}
                                    />
                                  </div>
                                </Match>
                              </Switch>
                            </div>
                          </VariableDropZone>
                        </>
                      );
                    }}
                  </For>

                  {/** Render each output grab source */}
                  <For each={Object.keys(node.outputs)}>
                    {(output) => (
                      <div
                        // @ts-expect-error directives are not supported
                        use:grabSource={{
                          type: "Variable",
                          id: node.id,
                          name: output,
                        }}
                      >
                        <VariableNode
                          name={`${output}: ${node.outputs[output].type}`}
                          id={node.id}
                        />
                      </div>
                    )}
                  </For>
                </NodeTypeWrapper>
              </div>
            </CanvasElement>
          </Show>
        );
      }}
    </For>
  );
}
