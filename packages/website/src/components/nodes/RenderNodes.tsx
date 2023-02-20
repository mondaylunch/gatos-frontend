import { For, Match, Switch } from "solid-js";
import { Graph } from "~/lib/types";

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
 * Render nodes within the graph
 */
export function RenderNodes(props: { graph: Graph }) {
  return (
    <For each={props.graph.nodes}>
      {(node) => {
        const metadata = props.graph.metadata[node.id];
        const connections = () =>
          props.graph.connections.filter((x) => x.input.nodeId === node.id);

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
  );
}
