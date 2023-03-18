import { useParams, useRouteData } from "solid-start";

import {DisplayNames, Flow, NodeType, User} from "~/lib/types";
import { createServerData$, redirect } from "solid-start/server";
import { constructUser, MountUser } from "~/lib/session";
import { ENDPOINT } from "~/lib/env";
import { getSession } from "@auth/solid-start";
import { onMount, Show } from "solid-js";
import { FlowEditor } from "~/components/nodes/FlowEditor";
import { Navbar } from "~/components/shared/Navbar";
import { createSignal } from "solid-js";
import { authOpts } from "../api/auth/[...solidauth]";
import {
  backendServersideFetch,
  createBackendFetchAction,
} from "~/lib/backend";

export function routeData() {
  return createServerData$(async (_, event) => {
    const session = await getSession(event.request, authOpts);

    if (!session || !session.user) {
      throw redirect("/");
    }

    const displayNames = await (backendServersideFetch(
      `/api/v1/display-names`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": event.request.headers.get("Accept-Language") ?? "en"
        }
      }).then(res => res.json() as Promise<DisplayNames>))

    return {
      user: constructUser(session),
      nodeTypes: await backendServersideFetch(
        "/api/v1/node-types",
        {},
        session
      ).then((res) => res.json() as Promise<NodeType[]>),
      displayNames
    };
  });
}

export default function FlowPage() {
  const params = useParams<{ id: string }>();
  const data = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col h-screen max-h-screen min-h-0">
      <Navbar />
      <Show when={data()}>
        <MountUser user={data()!.user} />
        <LoadFlow
          id={params.id}
          user={data()!.user}
          nodeTypes={data()!.nodeTypes}
          displayNames={data()!.displayNames}
        />
      </Show>
    </div>
  );
}

/**
 * Route data is funky so data fetching is off-loaded to this sub-component
 */
function LoadFlow(props: { id: string; user: User; nodeTypes: NodeType[], displayNames: DisplayNames }) {
  const [flow, setFlow] = createSignal<Flow>();
  const [_, sendBackendRequest] = createBackendFetchAction();

  // Fetch the flow once client has loaded
  onMount(() =>
    sendBackendRequest({
      route: `/api/v1/flows/${props.id}`,
      init: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    })
      .then((res) => res.json() as Promise<Flow>)
      .then(setFlow)
  );

  return (
    <Show when={flow()}>
      <FlowEditor flow={flow()!} nodeTypes={props.nodeTypes} displayNames={props.displayNames} />
    </Show>
  );
}
