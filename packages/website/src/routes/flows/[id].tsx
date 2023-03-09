import { useLocation, useRouteData } from "solid-start";

import { Flow, NodeType } from "~/lib/types";
import { createServerData$, redirect } from "solid-start/server";
import { ENDPOINT } from "~/lib/env";
import { Show } from "solid-js";
import { FlowEditor } from "~/components/nodes/FlowEditor";
import { getSession } from "@auth/solid-start";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { Navbar } from "~/components/shared/Navbar";
import { backendServersideFetch } from "~/lib/backend";
import { RouteDataFuncArgs } from "@solidjs/router";

export function routeData({ location }: RouteDataFuncArgs) {
  return createServerData$(
    async ([loc], event) => {
      const session = await getSession(event.request, authOpts);

      if (!session || !session.user) {
        throw redirect("/");
      }

      const flowId = loc.split("/").pop()!;
      const flow = await backendServersideFetch(
        `/api/v1/flows/${flowId}`,
        {
          method: "GET",
          headers: {},
        },
        session
      ).then((res) => res.json() as Promise<Flow>);

      return {
        user: session.user,
        flow,
        nodeTypes: await backendServersideFetch(
          "/api/v1/node-types",
          {},
          session
        ).then((res) => res.json() as Promise<NodeType[]>),
      };
    },
    { key: () => [location.pathname] }
  );
}

export default function FlowPage() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col h-screen max-h-screen min-h-0">
      <Navbar />
      <Show when={data()}>
        <FlowEditor flow={data()!.flow} nodeTypes={data()!.nodeTypes} />
      </Show>
    </div>
  );
}
