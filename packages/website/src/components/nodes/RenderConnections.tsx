import { Graph } from "~/lib/types";
import { For, useContext } from "solid-js";
import { ElementSizeContext } from "../editor/Canvas";

/**
 * Draw line connections between nodes
 */
export function RenderConnections(props: { graph: Graph }) {
  const [elementSizeCache] = useContext(ElementSizeContext)!;

  return (
    <For each={props.graph.connections}>
      {(connection, index) => {
        // Find the relevant metadata for output and input sides
        const outputMetadata = props.graph.metadata[connection.output.node_id];
        const inputMetadata = props.graph.metadata[connection.input.node_id];

        // Get size of output and input nodes.
        const outputRect = () =>
          elementSizeCache[connection.output.node_id] ?? {};
        const inputRect = () =>
          elementSizeCache[connection.input.node_id] ?? {};

        return (
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
        );
      }}
    </For>
  );
}
