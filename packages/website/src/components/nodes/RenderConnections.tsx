import {Graph} from "~/lib/types";
import {For, useContext} from "solid-js";
import {ElementSizeContext} from "../editor/Canvas";

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

                return (
                    <path
                        d={`M ${outputMetadata.xPos + outputRect().width / 2} ${outputMetadata.yPos + outputRect().height} 
                C ${outputMetadata.xPos + outputRect().width / 2} ${outputMetadata.yPos + outputRect().height + 100}
                ${inputMetadata.xPos + inputRect().width / 2} ${inputMetadata.yPos - 100}
                ${inputMetadata.xPos + inputRect().width / 2} ${inputMetadata.yPos}`}
                        class="stroke-white"
                        stroke-width="6"
                        stroke-linecap="round"
                        fill="transparent"
                    />
                );
            }}
        </For>
    );
}
