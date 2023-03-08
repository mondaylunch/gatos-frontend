import {Component, For, JSX, Match, Switch} from "solid-js";
import {Graph, NODE_TYPE_REGISTRY, NodeType} from "~/lib/types";

import {movable} from "../editor/directives/movable";
import {dropZone} from "../editor/directives/dropZone";
import {grabSource} from "../editor/directives/grabSource";
import {CanvasElement} from "../editor/CanvasElement";
import {InputNode, OutputNode, ProcessNode, VariableDropZone, VariableNode,} from "./Node";

movable;
dropZone;
grabSource;

const COMPONENTS: Record<
  NodeType["category"],
  Component<{ title: string; children?: JSX.Element }>
> = {
  input: InputNode,
  process: ProcessNode,
  output: OutputNode,
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
          <CanvasElement x={metadata.xPos} y={metadata.yPos} id={node.id}>
            {/** @ts-expect-error directives are not supported */}
            <div use:movable={{id: node.id}}>
              <Component title={nodeType.name}>
                {/** Render each input drop zone */}
                <For each={Object.keys(node.inputTypes)}>
                  {(inputName) => {
                    // Find all connections for this node matching this input
                    const connections = () =>
                      props.graph.connections.filter(
                        (x) =>
                          x.input.nodeId === node.id &&
                          x.input.name === inputName
                      );

                    return (
                      <>
                        <span>{inputName}</span>
                        <VariableDropZone>
                          {/** @ts-expect-error directives are not supported */}
                          <div use:dropZone={`node:${node.id}:${inputName}`}>
                            <Switch fallback={"Drop variables here"}>
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

                {/** Render each output grab source */}
                <For each={nodeType.outputs}>
                  {(output) => (
                    <div
                      // @ts-expect-error directives are not supported
                      use:grabSource={{
                        type: "Variable",
                        id: node.id,
                        name: output.name,
                      }}
                    >
                      <VariableNode name={output.name}/>
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
