import { For } from "solid-js";
import { Graph } from "~/lib/types";

/**
 * Draw line connections between nodes
 */
export function RenderConnections(props: { graph: Graph }) {
  return (
    <For each={props.graph.connections}>
      {(connection, index) => {
        const outputMetadata = props.graph.metadata[connection.output.nodeId];
        return (
          <text
            x={outputMetadata.xPos}
            y={outputMetadata.yPos + 180 + index() * 20}
            textContent={`draw line connection to ${connection.input.nodeId}`}
            fill="white"
          />
        );
      }}
    </For>
  );
}
