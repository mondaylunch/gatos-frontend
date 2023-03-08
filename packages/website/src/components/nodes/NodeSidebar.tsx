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
    FaSolidMagnifyingGlass, FaSolidSkullCrossbones
} from "solid-icons/fa";
import {CgToggleOn} from 'solid-icons/cg';
import {BsBoxArrowUpLeft, BsExclamationCircle} from "solid-icons/bs";
import {BiRegularArrowToLeft, BiRegularArrowToRight, BiRegularCodeCurly} from "solid-icons/bi";
import {TbArrowsJoin2, TbMapSearch} from "solid-icons/tb";
import {RiEditorTextSpacing} from "solid-icons/ri";
import {TiTickOutline} from "solid-icons/ti";
import {SiZeromq} from "solid-icons/si";
import {FiGlobe} from "solid-icons/fi";
import {AiOutlineQuestionCircle} from 'solid-icons/ai';

grabSource;

const [nodeTypes, setNodeTypes] = createSignal<NodeType[]>([]);

type NodeType = {
    name: string;
    category: string;
};

const Icons_Dict = {
    "list_length": FaSolidArrowsLeftRight,
    'variable_extraction': BsBoxArrowUpLeft,
    "string_interpolation": BiRegularCodeCurly,
    "http_request": FiGlobe,
    "is_nan": SiZeromq,
    "truthiness": TiTickOutline,
    "variable_remapping": TbMapSearch,
    "string_length": RiEditorTextSpacing,
    "string_concat": TbArrowsJoin2,
    "list_head_separation": BiRegularArrowToLeft,
    "is_finite": FaSolidSkullCrossbones,
    "list_tail_separation": BiRegularArrowToRight,
    "negation": BsExclamationCircle,
    "equals": FaSolidEquals,
    "string_contains": FaSolidMagnifyingGlass,
    "number_comparison": FaSolidGreaterThanEqual,
    "math": FaSolidCalculator,
    "boolean_operation": CgToggleOn,
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
        <div class="w-[240px] bg-neutral-700">
            <div class="flex flex-row flex-wrap">
                <For each={nodeTypes()}>
                    {(nodeType) => {
                        const Icon = Icons_Dict[nodeType.name as keyof typeof Icons_Dict];
                        // @ts-expect-error directives are not supported
                        return <div use:grabSource={{type: "NodeType", node: nodeType}}>
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="flex-1 w-1/2 max-w-xs rounded-xl border-4 1">
                                    <Switch fallback={<AiOutlineQuestionCircle fill="red-700"/>}>
                                        <Match when={nodeType.name in Icons_Dict}>
                                            <Icon size={64}/>
                                        </Match>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    }}
                </For>
            </div>
        </div>
    );
}
