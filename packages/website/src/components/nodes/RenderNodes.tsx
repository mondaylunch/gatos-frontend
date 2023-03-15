import { Component, For, JSX, Match, Show, Switch } from "solid-js";
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

const COMPONENTS: Record<
  NodeType["category"],
  Component<{ title: string; children?: JSX.Element }>
> = {
  start: InputNode,
  process: ProcessNode,
  end: OutputNode,
};

/**
 * Render nodes within the graph
 */
export function RenderNodes(props: { graph: Graph }) {
  return (
    <For each={props.graph.nodes}>
      {(node) => {
        // Find all relevant information to render the node
        const metadata = props.graph.metadata[node.id];
        const nodeType =
          NODE_TYPE_REGISTRY[node.type as keyof typeof NODE_TYPE_REGISTRY];
        const Component = COMPONENTS[nodeType.category];

        return (
          <Show when={metadata && nodeType}>
            <CanvasElement x={metadata.x_pos} y={metadata.y_pos} id={node.id}>
              {/** @ts-expect-error directives are not supported */}
              <div use:movable={{ id: node.id }}>
                <Component title={nodeType.name}>
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
                          <Switch
                            fallback={
                              <div class="text-white font-medium capitalize">
                                {inputName}: {node.inputs[inputName].type}
                              </div>
                            }
                          >
                            <Match when={nodeType.category == "process"}>
                              <div class="text-black font-medium capitalize">
                                {inputName}: {node.inputs[inputName].type}
                              </div>
                            </Match>
                          </Switch>
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
                </Component>
              </div>
            </CanvasElement>
          </Show>
        );
      }}
    </For>
  );
}
