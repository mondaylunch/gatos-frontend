import {useRouteData} from "solid-start";

import {Flow, NodeType} from "~/lib/types";
import {createServerData$, redirect} from "solid-start/server";
import {ENDPOINT} from "~/lib/env";
import {Show} from "solid-js";
import {FlowEditor} from "~/components/nodes/FlowEditor";
import {getSession} from "@auth/solid-start";
import {authOpts} from "~/routes/api/auth/[...solidauth]";
import {Navbar} from "~/components/shared/Navbar"
import {backendServersideFetch} from "~/lib/backend";
import {RouteDataFuncArgs} from "@solidjs/router";

export function routeData() {
  return createServerData$(async (_, event) => {
    const session = (await getSession(event.request, authOpts));

    if (!session || !session.user) {
      throw redirect("/");
    }

    // Route data doesn't provide params because Router is
    // inaccessible, so we just read the URL instead, which
    // is good enough for our purposes.
    const flowId = event.request.url.split("/").pop()!;

    return {
      user: session.user,
      flow: await fetch(`${ENDPOINT}/api/v1/flows/${flowId}`, {
        method: "GET",
        headers: {},
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
      <Navbar/>
      <Show when={data()}>
        <FlowEditor flow={data()!.flow} nodeTypes={data()!.nodeTypes}/>
      </Show>
    </div>
  );
}
