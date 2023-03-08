import { For } from "solid-js";
import { ENDPOINT } from "~/lib/env";
import { A, useNavigate, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import {
  MountUser,
  resolveUserByRouteEvent,
  setUser,
  user,
} from "~/lib/session";
import { Square_New, Square_File } from "~/components/dashboard/squares";
import { Navbar } from "~/components/shared/Navbar";

type Flow = {
  _id: string;
  name: string;
  description: string;
  author_id: string;
};

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);

    return {
      user,
      isLoggedIn: !!user,
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
  const navigate = useNavigate();

  async function createFlow() {
    const name = prompt("Enter flow name:");
    if (name) {
      await fetch(`${ENDPOINT}/api/v1/flows`, {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": user()!.auth_token,
        },
      })
        .then((res) => res.json())
        .then((flow) => navigate(`/flows/${flow._id}`));
    }
  }

  return (
    <div>
      <Navbar />
      <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
        <MountUser user={data()!.user} />
        <div class="absolute top-0 right-0 mr-5 mt-5"></div>

        <div class="grid grid-cols-4 gap-5">
          <a class="cursor-pointer" onClick={createFlow}>
            <Square_New />
          </a>
          <For each={data()?.flows ?? []}>
            {(flow) => (
              <A href={`/flows/${flow._id}`}>
                <Square_File title={flow.name} description={flow.description} />
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
