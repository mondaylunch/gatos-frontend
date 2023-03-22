import { grabSource } from "../editor/directives/grabSource";
import { For } from "solid-js";
import { NodeTypeDrag } from "~/components/editor/NodeTypeDrag";
import { NodeType, SORTED_NODE_TYPES } from "~/lib/types";

grabSource;

function NodeTypeList(props: { category: NodeType["category"] }) {
  return (
    <>
      <div class="text-xl capitalize text-white">{props.category}</div>
      <For
        each={SORTED_NODE_TYPES.filter(
          (type) => type.category === props.category
        )}
      >
        {(nodeType) => {
          return (
            // @ts-expect-error directives are not supported

            <div use:grabSource={{ type: "NodeType", node: nodeType }}>
              <NodeTypeDrag name={nodeType.name} />
            </div>
          );
        }}
      </For>
    </>
  );
}

export function NodeSidebar() {
  return (
    <div class="w-fit bg-neutral-700 min-h-0" style="overflow-y: auto;">
      <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-2 font-mono">
        Node Toolbox
      </h1>
      <div class="flex flex-col gap-2 pl-2 pr-2 font-bold mb-4">
        <NodeTypeList category="start" />
        <NodeTypeList category="end" />
        <NodeTypeList category="process" />
      </div>
    </div>
  );
}
