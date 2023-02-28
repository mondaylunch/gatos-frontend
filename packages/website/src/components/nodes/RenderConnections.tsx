import { For } from "solid-js";
import { Graph } from "~/lib/types";

/**
 * Draw line connections between nodes
 */
export function RenderConnections(props: { graph: Graph }) {
  return (
    <For each={props.graph.connections}>
      {(connection, index) => {
        // Find the relevant metadata for output and input sides
        const outputMetadata = props.graph.metadata[connection.output.nodeId];
        const inputMetadata = props.graph.metadata[connection.input.nodeId];

        // TODO: the code below needs to be replaced with line drawing code,
        // the line must be drawn from (output.x,y) to (input.x,y)
        return (
          <text
            x={outputMetadata.xPos}
            y={outputMetadata.yPos + 180 + index() * 20}
            textContent={`draw line connection from (${outputMetadata.xPos}, ${outputMetadata.yPos}) to (${inputMetadata.xPos}, ${inputMetadata.yPos})`}
            fill="white"
          />
        );
      }}
    </For>
  );
}
