import {
  Component,
  For,
  JSX,
  JSXElement,
  Match,
  Show,
  splitProps,
  Switch,
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
                      // Find all connections for this node matching this input
                      const connections = () =>
                        props.graph.connections.filter(
                          (x) =>
                            x.input.node_id === node.id &&
                            x.input.name === inputName
                        );

                      return (
                        <>
                          <span>
                            {inputName}: {node.inputs[inputName].type}
                          </span>
                          <VariableDropZone>
                            {/** @ts-expect-error directives are not supported */}
                            <div use:dropZone={`node:${node.id}:${inputName}`}>
                              <Switch fallback={"Drop variables here"}>
                                <Match when={connections().length}>
                                  <For each={connections()}>
                                    {(connection) => (
                                      <VariableNode
                                        name={connection.output.name}
                                        id={connection.output.node_id}
                                      />
                                    )}
                                  </For>
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
