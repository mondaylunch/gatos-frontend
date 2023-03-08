import {grabSource} from "../editor/directives/grabSource";
import {ProcessNode} from "./Node";
import {createServerData$} from "solid-start/server";
import {ENDPOINT} from "~/lib/env";
import {createSignal, For, Match, Switch} from "solid-js";
import {
    FaSolidArrowsLeftRight,
    FaSolidBox,
    FaSolidCalculator, FaSolidEquals,
    FaSolidGreaterThanEqual,
    FaSolidMagnifyingGlass, FaSolidSkullCrossbones, FaSolidToggleOn,
    FaSolidUpRightFromSquare, FaSolidCircleExclamation, FaSolidArrowRight,
    FaSolidArrowLeft, FaSolidQuoteLeft, FaSolidDownLeftAndUpRightToCenter,
    FaSolidSignsPost, FaSolidRuler, FaSolidCircleCheck, FaSolidTriangleExclamation,
    FaSolidGlobe, FaSolidCircleQuestion
} from "solid-icons/fa";

grabSource;

const [nodeTypes, setNodeTypes] = createSignal<NodeType[]>([]);

type NodeType = {
    name: string;
    category: string;
};

const Icons_Dict = {
    "list_length": FaSolidArrowsLeftRight,
    'variable_extraction': FaSolidUpRightFromSquare,
    "string_interpolation": FaSolidQuoteLeft,
    "http_request": FaSolidGlobe,
    "is_nan": FaSolidTriangleExclamation,
    "truthiness": FaSolidCircleCheck,
    "variable_remapping": FaSolidSignsPost,
    "string_length": FaSolidRuler,
    "string_concat": FaSolidDownLeftAndUpRightToCenter,
    "list_head_separation": FaSolidArrowLeft,
    "is_finite": FaSolidSkullCrossbones,
    "list_tail_separation": FaSolidArrowRight,
    "negation": FaSolidCircleExclamation,
    "equals": FaSolidEquals,
    "string_contains": FaSolidMagnifyingGlass,
    "number_comparison": FaSolidGreaterThanEqual,
    "math": FaSolidCalculator,
    "boolean_operation": FaSolidToggleOn,
    "optional_or_else": FaSolidBox,
}

export function routeData() {
    return createServerData$(async (_, event) => {
        return {
            NodeTypes: await fetch(`${ENDPOINT}/api/v1/node-types`, {
                method: "GET",
            }).then((res) => (res.ok ? (res.json() as Promise<NodeType[]>) : [])),
        };
    });
}

function loadNodeTypes() {
    fetch(`${ENDPOINT}/api/v1/node-types`, {
        method: "GET",
    })
        .then((res) => res.json() as Promise<NodeType[]>)
        .then((data) => {
            if (!isNaN(data.length)) {
                setNodeTypes(data);
            }
        });
}

export function NodeSidebar() {
    loadNodeTypes();
    return (
        <div class="w-[240px] bg-neutral-700 min-h-0 ">
            <div class="flex flex-col gap-2 pl-2 pr-2">
                <For each={nodeTypes()}>
                    {(nodeType) => {
                        const Icon = Icons_Dict[nodeType.name as keyof typeof Icons_Dict];
                        // @ts-expect-error directives are not supported
                        return <div use:grabSource={{type: "NodeType", node: nodeType}}>
                            <div
                                class="flex text-w-full rounded-[30px] border-4 place-content-center bg-white justify-items-center items-center gap-2 pl-1">
                                <Switch fallback={
                                    <div>
                                        <FaSolidCircleQuestion size={20} fill="red-700"/>
                                        <p class="font-bold flex-grow">
                                            {nodeType.name}
                                        </p>
                                    </div>
                                }>
                                    <Match when={nodeType.name in Icons_Dict}>
                                        <Icon size={20}/>
                                        <p class="font-bold flex-grow">
                                            {nodeType.name}
                                        </p>
                                    </Match>
                                </Switch>
                            </div>
                        </div>
                    }}
                </For>
            </div>
        </div>
    );
}
