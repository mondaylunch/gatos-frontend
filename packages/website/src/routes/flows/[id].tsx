import { useRouteData } from "solid-start";

import { Flow, NodeType } from "~/lib/types";
import { createServerData$ } from "solid-start/server";
import { MountUser, resolveUserByRouteEvent, setUser } from "~/lib/session";
import { ENDPOINT } from "~/lib/env";
import { Show } from "solid-js";
import { FlowEditor } from "~/components/nodes/FlowEditor";
import { Navbar } from "~/components/shared/Navbar";

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);

    // Route data doesn't provide params because Router is
    // inaccessible, so we just read the URL instead, which
    // is good enough for our purposes.
    const stateSymbol = Object.getOwnPropertySymbols(event.request).find(
      (symbol) => symbol.description === "state"
    )!;
    const url: URL = (event.request as any)[stateSymbol].url;
    const flowId = url.href.split("/").pop()!;

    return {
      user,
      flow: await fetch(`${ENDPOINT}/api/v1/flows/${flowId}`, {
        method: "GET",
        headers: {
          "X-Auth-Token": user.auth_token,
        },
      }).then((res) => res.json() as Promise<Flow>),
      nodeTypes: await fetch(`${ENDPOINT}/api/v1/node-types`).then(
        (res) => res.json() as Promise<NodeType[]>
      ),
    };
  });
}

export default function FlowPage() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col h-screen max-h-screen min-h-0">
      <Navbar />
      <Show when={data()}>
        <MountUser user={data()!.user} />
        <FlowEditor flow={data()!.flow} nodeTypes={data()!.nodeTypes} />
      </Show>
    </div>
  );
}
