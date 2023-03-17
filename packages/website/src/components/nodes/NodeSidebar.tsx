import { grabSource } from "../editor/directives/grabSource";
import { ProcessNode } from "./Node";
import { createServerData$ } from "solid-start/server";
import { ENDPOINT } from "~/lib/env";
import { createSignal, For, Match, Switch } from "solid-js";
import { NodeTypeDrag } from "~/components/editor/NodeTypeDrag";
import {
  backendServersideFetch,
  createBackendFetchAction,
} from "~/lib/backend";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { getSession } from "@auth/solid-start";

grabSource;

const [nodeTypes, setNodeTypes] = createSignal<NodeType[]>([]);

type NodeType = {
  name: string;
  category: string;
  displayName: string;
};

export function routeData() {
  return createServerData$(async (_, event) => {
    return {
      NodeTypes: await backendServersideFetch(
        "/api/v1/node-types",
        {
          method: "GET",
        },
        await getSession(event.request, authOpts)
      ).then((res) => (res.ok ? (res.json() as Promise<NodeType[]>) : [])),
    };
  });
}

function loadNodeTypes() {
  const [_, sendBackendRequest] = createBackendFetchAction();
  sendBackendRequest({
    route: "/api/v1/node-types",
    init: {
      method: "GET",
    },
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
    <div class="w-fit bg-neutral-700 min-h-0" style="overflow-y: auto;">
      <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-2font-mono">
        Node Toolbox
      </h1>
      <hr class="border-t-2 my-2 mx-2" />
      <div class="flex flex-col gap-2 pl-2 pr-2 font-bold mb-4">
        <For each={nodeTypes()}>
          {(nodeType) => {
            return (
              // @ts-expect-error directives are not supported

              <div use:grabSource={{ type: "NodeType", node: nodeType }}>
                <NodeTypeDrag
                  name={nodeType.name}
                  displayName={nodeType.displayName}
                />
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
