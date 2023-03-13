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

import { FaSolidInfo } from "solid-icons/fa";

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
  const navigate = useNavigate();
  const [_, sendBackendRequest] = createBackendFetchAction();
  const [name, setName] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);

  async function handleSubmit() {
    if (name()) {
      await sendBackendRequest({
        route: "/api/v1/flows",
        init: {
          method: "POST",
          body: JSON.stringify({
            name: name(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
        .then((res) => res.json())
        .then((flow) => navigate(`/flows/${flow._id}`));
      setShowModal(true);
    }
  }

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
              <A href={`/flows/${flow._id}`}>
                <Square_File title={flow.name} description={flow.description} />
              </A>
            )}
          </For>
        </div>
        <Show when={showModal()}>
          <div class="fixed inset-0 top-0 bottom-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-gray-500 bg-opacity-75">
              <div class="bg-white rounded-lg p-8 max-w-xs mx-auto">
                <div class="text-2xl font-bold mb-4">Create a new flow</div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Name:
                  </label>
                  <input
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Flow name"
                  />
                </div>
                <div class="flex justify-end">
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                  <button
                    class="bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
