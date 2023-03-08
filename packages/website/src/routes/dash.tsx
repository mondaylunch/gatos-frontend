import {For} from "solid-js";
import {ENDPOINT} from "~/lib/env";
import {A, useNavigate, useRouteData} from "solid-start";
import {createServerData$, redirect} from "solid-start/server";
import {Square_File, Square_New} from "~/components/dashboard/squares";
import {getSession} from "@auth/solid-start";
import {authOpts} from "~/routes/api/auth/[...solidauth]";
import {getToken} from "@auth/core/jwt";

type Flow = {
  _id: string;
  name: string;
  description: string;
  author_id: string;
};

export function routeData() {
  return createServerData$(async (_, event) => {
    const session = (await getSession(event.request, authOpts));

    if (!session || !session.user) {
      throw redirect("/");
    }

    const token = await getToken({req: event.request, secret: authOpts.secret, raw: true})

    return {
      user: session.user,
      token: token,
      flows: await fetch(`${ENDPOINT}/api/v1/flows/list`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
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
          "Authorization": "Bearer " + data()!.token,
        },
      })
        .then((res) => res.json())
        .then((flow) => navigate(`/flows/${flow._id}`));
    }
  }

  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
      <div class="absolute top-0 right-0 mr-5 mt-5">
        <p class="text-neutral-200 font-medium">Hi {data()?.user?.name}</p>
      </div>

      <div class="grid grid-cols-4 gap-5">
        <a class="cursor-pointer" onClick={createFlow}>
          <Square_New/>
        </a>
        <For each={data()?.flows ?? []}>
          {(flow) => (
            <A href={`/flows/${flow._id}`}>
              <Square_File title={flow.name} description={flow.description}/>
            </A>
          )}
        </For>
      </div>
    </div>
  );
}
