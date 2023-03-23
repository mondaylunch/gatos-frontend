import { createSignal, Match, Switch } from "solid-js";

interface Props {
  onHide: () => void;
  execute: (data: string) => Promise<unknown>;
}

export function ExecuteModal(props: Props) {
  const [data, setData] = createSignal("{}");
  const [response, setResponse] = createSignal<string>();
  const [state, setState] = createSignal<
    "ready" | "waiting" | "error" | "finished"
  >("ready");

  async function execute() {
    setState("waiting");

    try {
      setResponse(JSON.stringify(await props.execute(data()), null, 2));
      setState("finished");
    } catch (err: any) {
      setResponse("" + (err?.message ?? err));
      setState("error");
    }
  }

  return (
    <div class="fixed inset-0 flex items-center justify-center flex-col bg-gray-500 bg-opacity-75 z-20">
      <div class="bg-neutral-800 rounded-lg p-8 max-w-xs mx-auto outline outline-indigo-600 outline-offset-2">
        <Switch
          fallback={
            <>
              <div class="text-2xl font-bold mb-4 text-white">Execute</div>
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2 text-white">
                  Data
                </label>
                <input
                  value={data()}
                  onInput={(e) => setData(e.currentTarget.value)}
                  class={`shadow bg-zinc-800 appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline ${
                    !data() ? "outline-red-500 outline outline-offset-1" : ""
                  }`}
                  type="text"
                  placeholder="Flow name..."
                  required
                />
              </div>
              <div class="flex justify-end">
                <button
                  class="flex-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={execute}
                >
                  Execute
                </button>
                <button
                  class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  onClick={props.onHide}
                >
                  Cancel
                </button>
              </div>
            </>
          }
        >
          <Match when={state() === "waiting"}>
            <div class="text-2xl font-bold mb-4 text-white">Executing...</div>
            <div class="flex justify-end">
              <button
                class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={props.onHide}
              >
                Dismiss
              </button>
            </div>
          </Match>
          <Match when={state() === "error"}>
            <div class="text-2xl font-bold mb-4 text-white">Failed</div>
            <div class="mb-4 text-white overflow-x-hidden overflow-y-scroll h-24">
              {response()}
            </div>
            <div class="flex justify-end">
              <button
                class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={props.onHide}
              >
                Dismiss
              </button>
            </div>
          </Match>
          <Match when={state() === "finished"}>
            <div class="text-2xl font-bold mb-4 text-white">Result</div>
            <pre class="mb-4 text-white">
              <code>{response()}</code>
            </pre>
            <div class="flex justify-end">
              <button
                class="flex-auto bg-gray-300 hover:bg-gray-400 text=gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={props.onHide}
              >
                Close
              </button>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
