import styles from "./editor.module.css";

import {createStore} from "solid-js/store";
import {Meta} from "solid-start";
import {
    Flow,
    Graph,
    loadNodeTypes,
    NodeType,
    SAMPLE_FLOW_DATA,
} from "~/lib/types";
import {VariableNode} from "./Node";
import {NodeSidebar} from "./NodeSidebar";
import {RenderConnections} from "./RenderConnections";
import {RenderNodes} from "./RenderNodes";
import {InteractiveCanvas} from "../editor/InteractiveCanvas";
import {SettingsSidebar} from "./SettingsSidebar";
import {Match, Switch} from "solid-js";
import {NodeTypeDrag} from "~/components/editor/NodeTypeDrag";

/**
 * Populate Graph with missing metadata
 * @param graph Graph
 * @returns Populated Graph
 */
function populate(
    graph: Graph = {connections: [], metadata: {}, nodes: []}
): Graph {
    const metadata = {...graph.metadata};
    for (const node of graph.nodes) {
        if (!metadata[node.id]) {
            metadata[node.id] = {
                xPos: 0,
                yPos: 0,
            };
        }
    }

    return {
        ...graph,
        metadata,
    };
}

type Grabbable =
    | {
    type: "NodeType";
    node: NodeType;
}
    | {
    type: "Variable";
    id: string;
    name: string;
};

export function FlowEditor(props: { flow: Flow; nodeTypes: NodeType[] }) {
    loadNodeTypes(props.nodeTypes);
    const [graph, updateGraph] = createStore<Graph>(populate(props.flow.graph));

    /**
     * Debugging
     */
    if (typeof window !== "undefined") {
        loadNodeTypes([
            {name: "test_start", category: "input"},
            {name: "test_process", category: "process"},
            {name: "test_end", category: "output"},
        ]);

        (window as any).__setDebugGraph = () =>
            updateGraph(populate(SAMPLE_FLOW_DATA.graph));
    }

    /**
     * Handle move events from canvas
     * @param ref Reference object
     * @param param1 Movement information
     */
    function handleMove(
        ref: { id: string },
        [movementX, movementY]: [number, number]
    ) {
        updateGraph("metadata", ref.id, "xPos", (x) => x + movementX);
        updateGraph("metadata", ref.id, "yPos", (y) => y + movementY);
    }

    /**
     * Handle drop event from canvas
     * @param param1 Position of dropped element
     * @param ref Reference object
     * @param targetNodeId Target drop zone
     */
    function handleDrop(
        [xPos, yPos]: [number, number],
        ref: Grabbable,
        targetNodeId?: string
    ) {
        if (ref.type === "Variable" && targetNodeId) {
            const [type, nodeId, inputName] = targetNodeId.split(":");
            if (type === "node") {
                // Get the node we are connecting to
                const inputNode = graph.nodes.find((node) => node.id === nodeId)!;
                const outputNode = graph.nodes.find((node) => node.id === ref.id)!;

                // 1. If the input or output does not exist, reject.
                if (!inputNode || !outputNode) return;

                // 2. If the variable types differ, reject.
                const output = outputNode.outputs[ref.name];
                const input = inputNode.inputs[inputName];
                if (!output) throw `Output "${ref.name}" not defined in the node!`;
                if (!input) throw `Input "${inputName}" not defined in the node!`;
                if (output.type !== input.type) return;

                // 3. If an input connection already exists, reject.
                if (
                    graph.connections.find(
                        (connection) =>
                            connection.input.nodeId === nodeId &&
                            connection.input.name === inputName
                    )
                )
                    return console.info("Ignoring duplicate connection to input.");

                // Connect the two sides
                updateGraph("connections", [
                    ...graph.connections,
                    {
                        output: {
                            nodeId: ref.id,
                            name: ref.name,
                            type: output.type,
                        },
                        input: {
                            nodeId: nodeId,
                            name: inputName,
                            type: input.type,
                        },
                    },
                ]);
            }
        }

        if (ref.type === "NodeType") {
            // Create a new node
            const id = crypto.randomUUID();
            updateGraph("metadata", id, {
                xPos,
                yPos,
            });
            updateGraph("nodes", (nodes) => [
                ...nodes,
                {
                    id,
                    type: ref.node.name,
                    settings: {},
                    inputs: {},
                    outputs: {},
                },
            ]);
        }
    }

    /**
     * Render virtual grabbed element
     * @param ref Object reference
     */
    function renderVirtualElement(ref: Grabbable) {
        return (
            <Switch>
                <Match when={ref.type === "Variable"}>
                    <VariableNode name={(ref as Grabbable & { type: "Variable" }).id}/>
                </Match>
                <Match when={ref.type === "NodeType"}>
                    <NodeTypeDrag name={(ref as Grabbable & { type: "NodeType" }).node.name}/>
                </Match>
            </Switch>
        );
    }

    return (
        <InteractiveCanvas
            containerProps={{
                class: styles.container,
            }}
            canvasProps={{
                class: styles.canvas,
            }}
            preCanvas={
                <>
                    <Meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, user-scalable=no"
                    />
                    <NodeSidebar/>
                </>
            }
            postCanvas={<SettingsSidebar/>}
            handleMove={handleMove}
            handleDrop={handleDrop}
            handleSelect={() => void 0}
            renderVirtualElement={renderVirtualElement}
        >
            <RenderConnections graph={graph}/>
            <RenderNodes graph={graph}/>
        </InteractiveCanvas>
    );
}
