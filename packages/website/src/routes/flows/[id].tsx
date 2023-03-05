import { useRouteData } from "solid-start";

import { Flow } from "~/lib/types";
import { createServerData$ } from "solid-start/server";
import { resolveUserByRouteEvent } from "~/lib/session";
import { ENDPOINT } from "~/lib/env";
import { Show } from "solid-js";
import { FlowEditor } from "~/components/nodes/FlowEditor";

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);
    const flowId = event.request.url.split("/").pop()!;

    return {
      user,
      flow: await fetch(`${ENDPOINT}/api/v1/flows/${flowId}`, {
        method: "GET",
        headers: {
          "X-Auth-Token": user.auth_token,
        },
      }).then((res) => res.json() as Promise<Flow>),
    };
  });
}

export default function FlowPage() {
  const data = useRouteData<typeof routeData>();

  return (
    <Show when={data()}>
      <FlowEditor flow={data()!.flow} />
    </Show>
  );
}
