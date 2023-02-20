import { Component, For, JSX, Match, Show, Switch } from "solid-js";
import { Graph, NODE_TYPES } from "~/lib/types";

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
  keyof typeof NODE_TYPES,
  Component<{ title: string; children?: JSX.Element }>
> = {
  test_start: InputNode,
  test_process: ProcessNode,
  test_end: OutputNode,
};

/**
 * Render nodes within the graph
 */
export function RenderNodes(props: { graph: Graph }) {
  return (
    <For each={props.graph.nodes}>
      {(node) => {
        const metadata = props.graph.metadata[node.id];

        const Component = COMPONENTS[node.type as keyof typeof NODE_TYPES];
        const nodeType = NODE_TYPES[node.type as keyof typeof NODE_TYPES];

        return (
          <CanvasElement x={metadata.xPos} y={metadata.yPos}>
            <div use:movable={{ id: node.id }}>
              <Component title="node title">
                <For each={nodeType.inputs}>
                  {(input) => {
                    const connections = () =>
                      props.graph.connections.filter(
                        (x) =>
                          x.input.nodeId === node.id &&
                          x.input.name === input.name
                      );

                    return (
                      <>
                        <span>{input.name}</span>
                        <VariableDropZone>
                          <div use:dropZone={`node:${node.id}:${input.name}`}>
                            <Switch fallback={"drop variables here"}>
                              <Match when={connections().length}>
                                <For each={connections()}>
                                  {(connection) => (
                                    <VariableNode
                                      name={connection.output.name}
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
                <For each={nodeType.outputs}>
                  {(output) => (
                    <div use:grabSource={{ id: node.id, name: output.name }}>
                      <VariableNode name={output.name} />
                    </div>
                  )}
                </For>
              </Component>
            </div>
          </CanvasElement>
        );
      }}
    </For>
  );
}
