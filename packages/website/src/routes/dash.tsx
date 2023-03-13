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
import { FaSolidSquarePlus } from "solid-icons/fa";

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
  const [description, setDescription] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);

  async function handleSubmit() {
    if (name()) {
      await sendBackendRequest({
        route: "/api/v1/flows",
        init: {
          method: "POST",
          body: JSON.stringify({
            name: name(),
            description: description() || "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
        .then((res) => res.json())
        .then((flow) => navigate(`/flows/${flow._id}`));
      setShowModal(true);
    } else {
      setSubmitted(true);
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
          <Show when={showModal()}>
            <div class="fixed inset-0 flex items-center justify-center flex-col bg-gray-500 bg-opacity-75">
              <div class="bg-neutral-800 rounded-lg p-8 max-w-xs mx-auto outline outline-indigo-600 outline-offset-2">
                <FaSolidSquarePlus size={48} color="#4f46e5" />
                <div class="text-2xl font-bold mb-4 text-white">New Flow:</div>
                <div class="mb-4">
                  <label class="block text-sm font-bold mb-2 text-white">
                    Name:
                  </label>
                  <input
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    class={`shadow bg-zinc-800 appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline ${
                      submitted() && !name()
                        ? "outline-red-500 outline outline-offset-1"
                        : ""
                    }`}
                    type="text"
                    placeholder="Flow name..."
                    required
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-white text-sm font-bold mb-2">
                    Description:
                  </label>
                  <input
                    value={description()}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                    class="shadow bg-zinc-800 appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Flow description..."
                  />
                </div>
                <div class="flex justify-end">
                  <button
                    class="flex-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                  <button
                    class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                    onClick={() => {
                      setShowModal(false);
                      setSubmitted(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
