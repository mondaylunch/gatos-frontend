import { For, createSignal, Show } from "solid-js";
import { ENDPOINT } from "~/lib/env";
import { A, useNavigate, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { Square_File, Square_New } from "~/components/dashboard/squares";
import { getSession } from "@auth/solid-start";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { Navbar } from "~/components/shared/Navbar";
import { constructUser, MountUser } from "~/lib/session";
import {
  backendServersideFetch,
  createBackendFetchAction,
} from "~/lib/backend";
import { newModal } from "~/components/dashboard/newModal";

type Flow = {
  _id: string;
  name: string;
  description: string;
  author_id: string;
};

export function routeData() {
  return createServerData$(async (_, event) => {
    const session = await getSession(event.request, authOpts);

    if (!session || !session.user) {
      throw redirect("/");
    }

    const flows = await backendServersideFetch(
      "/api/v1/flows",
      {
        method: "GET",
      },
      session
    ).then((res) => (res.ok ? (res.json() as Promise<Flow[]>) : []));

    return {
      user: constructUser(session),
      flows,
    };
  });
}

export default function Dash() {
  const data = useRouteData<typeof routeData>();
  const [showModal, setShowModal] = createSignal(false);

  return (
    <div>
      <Navbar />
      <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
        <MountUser user={data()!.user} />
        <div class="absolute top-0 right-0 mr-5 mt-5"></div>
        <div class="grid grid-cols-4 gap-5">
          <a class="cursor-pointer" onClick={() => setShowModal(true)}>
            <Square_New />
          </a>
          <For each={data()?.flows ?? []}>
            {(flow) => (
              <Square_File
                title={flow.name}
                description={flow.description}
                id={flow._id}
              />
            )}
          </For>
          <Show when={showModal()}>{newModal(setShowModal)}</Show>
        </div>
      </div>
    </div>
  );
}
