import { For } from "solid-js";
import { ENDPOINT } from "~/lib/env";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { resolveUserByRouteEvent } from "~/lib/session";
import { Square_New, Square_File } from "~/components/dashboard/squares";
import { AiOutlineUser } from 'solid-icons/ai'
import { Button } from "~/components/inputs/Buttons";

type Flow = {
  id: string;
  name: string;
  description: string;
  author_id: string;
};

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);

    return {
      user,
      flows: await fetch(`${ENDPOINT}/api/v1/flows/list`, {
        method: "GET",
        headers: {
          "X-Auth-Token": user.auth_token,
        },
      }).then((res) => (res.ok ? (res.json() as Promise<Flow[]>) : [])),
    };
  });
}

export default function Dash() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
      <div class="absolute top-0 right-0 mr-5 mt-5">
        <a href="/account">
          <button class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
            <p class="text-neutral-200 font-medium text-3xl">
              <AiOutlineUser class="inline-block w-8 h-8" />{data()?.user.username}
            </p>
          </button>
        </a>
      </div>
      <div class="grid grid-cols-4 gap-5">
        <Square_New />
        <For each={data()?.flows ?? []}>
          {(flow) => (
            <Square_File title={flow.name} description={flow.description} />
          )}
        </For>
      </div>
    </div>
  );
}
