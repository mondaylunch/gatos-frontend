import { Graph } from "~/lib/types";
import { For, Show, useContext } from "solid-js";
import { ElementSizeContext } from "../editor/Canvas";
import { GrabbedSignalContext } from "../editor/InteractiveCanvas";
import { Grabbable } from "./FlowEditor";

/**
 * Draw line connections between nodes
 */
export function RenderConnections(props: { graph: Graph }) {
  const [elementSizeCache] = useContext(ElementSizeContext)!;
  const grabbed = useContext(GrabbedSignalContext);

  return (
    <For each={props.graph.connections}>
      {(connection, index) => {
        // Determine whether this connection is visible
        const visible = () => {
          const currentZone = `node:${connection.input.node_id}:${connection.input.name}`;

          // Hide the connection if it is currently grabbed
          const ref = grabbed!() as Grabbable;
          if (
            ref?.type === "ExistingConnection" &&
            ref.connector === connection.output &&
            ref.currentZone === currentZone
          ) {
            return undefined;
          }

          return true;
        };

        // Find the relevant metadata for output and input sides
        const outputMetadata = props.graph.metadata[connection.output.node_id];
        const inputMetadata = props.graph.metadata[connection.input.node_id];

        // Get size of output and input nodes.
        const outputRect = () =>
          elementSizeCache[connection.output.node_id] ?? {};
        const inputRect = () =>
          elementSizeCache[connection.input.node_id] ?? {};

        return (
          <Show when={visible()}>
            <path
              d={`M ${outputMetadata.x_pos + outputRect().width / 2} ${
                outputMetadata.y_pos + outputRect().height
              } 
                C ${outputMetadata.x_pos + outputRect().width / 2} ${
                outputMetadata.y_pos + outputRect().height + 100
              }
                ${inputMetadata.x_pos + inputRect().width / 2} ${
                inputMetadata.y_pos - 100
              }
                ${inputMetadata.x_pos + inputRect().width / 2} ${
                inputMetadata.y_pos
              }`}
              style={{
                stroke: `hsl(${parseInt(
                  connection.output.node_id.substring(0, 6),
                  16
                )}, 90%, 60%)`,
              }}
              stroke-width="6"
              stroke-linecap="round"
              fill="transparent"
            />
          </Show>
        );
      }}
    </For>
  );
}
