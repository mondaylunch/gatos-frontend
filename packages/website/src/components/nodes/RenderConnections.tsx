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
        const outputMetadata = props.graph.metadata[connection.output.nodeId];
        const inputMetadata = props.graph.metadata[connection.input.nodeId];

        // Get size of output and input nodes.
        const outputRect = () =>
          elementSizeCache[connection.output.nodeId] ?? {};
        const inputRect = () => elementSizeCache[connection.input.nodeId] ?? {};

        // TODO: the code below needs to be replaced with line drawing code,
        // the line must be drawn from (output.x,y) to (input.x,y)
        return (
            <line x1={outputMetadata.xPos + outputRect().width/2} y1={outputMetadata.yPos+outputRect().height} x2={inputMetadata.xPos+inputRect().width/2} y2={inputMetadata.yPos} stroke="white" />
        );
      }}
    </For>
  );
}
