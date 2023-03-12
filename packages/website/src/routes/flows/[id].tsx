import { useParams, useRouteData } from "solid-start";

import { Flow, NodeType, User } from "~/lib/types";
import { createServerData$ } from "solid-start/server";
import { MountUser, resolveUserByRouteEvent, setUser } from "~/lib/session";
import { ENDPOINT } from "~/lib/env";
import { createEffect, on, onMount, Show } from "solid-js";
import { FlowEditor } from "~/components/nodes/FlowEditor";
import { Navbar } from "~/components/shared/Navbar";
import { createSignal } from "solid-js";

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);

    return {
      user,
      nodeTypes: await fetch(`${ENDPOINT}/api/v1/node-types`).then(
        (res) => res.json() as Promise<NodeType[]>
      ),
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
        />
      </Show>
    </div>
  );
}

/**
 * Route data is funky so data fetching is off-loaded to this sub-component
 */
function LoadFlow(props: { id: string; user: User; nodeTypes: NodeType[] }) {
  const [flow, setFlow] = createSignal<Flow>();

  // Fetch the flow once client has loaded
  onMount(() =>
    fetch(`${ENDPOINT}/api/v1/flows/${props.id}`, {
      method: "GET",
      headers: {
        "X-Auth-Token": props.user.auth_token,
      },
    })
      .then((res) => res.json() as Promise<Flow>)
      .then(setFlow)
  );

  return (
    <Show when={flow()}>
      <FlowEditor flow={flow()!} nodeTypes={props.nodeTypes} />
    </Show>
  );
}
