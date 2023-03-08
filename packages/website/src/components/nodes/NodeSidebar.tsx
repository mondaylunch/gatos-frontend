import {grabSource} from "../editor/directives/grabSource";
import {ProcessNode} from "./Node";
import {createServerData$} from "solid-start/server";
import {ENDPOINT} from "~/lib/env";
import {createSignal, For} from "solid-js";

grabSource;

const [nodeTypes, setNodeTypes] = createSignal<NodeType[]>([]);

type NodeType = {
  name: string;
  category: string;
};

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
      <div class="flex flex-col items-center justify-center">
        <For each={nodeTypes()}>
          {(nodeType) => (
            // @ts-expect-error directives are not supported
            <div use:grabSource={{type: "NodeType", node: nodeType}}>
              <ProcessNode title={nodeType.name}/>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
