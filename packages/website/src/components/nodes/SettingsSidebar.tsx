import { ExecuteModal } from "./modals/ExecuteModal";
import { getWidget, Graph } from "~/lib/types";
import { createSignal, For, Match, Show, Switch, useContext } from "solid-js";
import { SelectedElementContext } from "../editor/InteractiveCanvas";
import { FormInput } from "../forms/FormInput";
import { GraphAction, ValidationResultContext } from "./FlowEditor";
import { getDisplayName } from "~/lib/types";

interface SidebarProps {
  graph: Graph;
  updateGraph: (action: GraphAction) => void;
  copyWebhookURL: (node_id: string) => void;
  execute: (node_id: string, data: object) => Promise<unknown>;
}

export function SettingsSidebar(props: SidebarProps) {
  const [selected] = useContext(SelectedElementContext)!;
  const validationResult = useContext(ValidationResultContext)!;
  const node = () =>
    selected()
      ? props.graph.nodes.find((node) => node.id === selected())
      : undefined;

  const [showExecute, setShowExecute] = createSignal(false);

  const errors = () =>
    node()
      ? validationResult().errors.filter(
          (error) => error.relatedNode === node()?.id
        )
      : validationResult().errors.filter((error) => !error.relatedNode);

  const webhookExecuteNodeId = () => {
    const current = node();
    if (current) {
      return current.type === "webhook_start" ? current.id : undefined;
    }

    const webhookNodes = props.graph.nodes.filter(
      (node) => node.type === "webhook_start"
    );

    if (webhookNodes.length === 1) {
      return webhookNodes[0].id;
    }
  };

  return (
    <div class="h-full bg-neutral-700 w-[360px] flex flex-col">
      <Show when={errors().length}>
        <h1 class="text-white text-2xl text-center bg-red-500 rounded-md mt-2 ml-1 mr-1 mb-4 font-bold">
          Errors
        </h1>
        <div class=" text-white flex flex-col gap-4 p-4 bg-neutral-600 ml-2 mr-2 mb-2 rounded-md">
          <For each={errors()}>
            {(error) => <span class="text-white mx-1">{error.message}</span>}
          </For>
        </div>
      </Show>

      <Show when={webhookExecuteNodeId() && !validationResult().errors.length}>
        <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-2 font-bold">
          Webhook
        </h1>
        <button
          class="bg-green-600 rounded-lg flex z-10 items-center justify-center font-bold text-white m-2 pt-1 pb-1"
          onClick={() => setShowExecute(true)}
        >
          Execute
        </button>
        <button
          class="bg-blue-600 rounded-lg flex z-10 items-center justify-center font-bold text-white m-2 pt-1 pb-1"
          onClick={() => props.copyWebhookURL(webhookExecuteNodeId())}
        >
          Copy URL
        </button>
      </Show>

      <Switch
        fallback={
          <>
            <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-4 font-bold">
              Node Settings
            </h1>
            <div class="text-white grid place-items-center">Select a node</div>
          </>
        }
      >
        <Match when={node()}>
          <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-4 font-bold">
            Node Settings
          </h1>
          <div class=" text-white flex flex-col gap-4 p-4 bg-neutral-600 ml-2 mr-2 mb-2 rounded-md">
            <span class="text-xl">
              {getDisplayName("node_type", node()!.type)}
            </span>
            <span class="text-xs select-all">{selected()}</span>
            <For each={Object.keys(node()!.settings)}>
              {(key) => {
                const entry = () => node()!.settings[key];
                const type = () => entry().type;

                const widget = () => getWidget(type());

                const apply = (value: any) =>
                  props.updateGraph({
                    type: "UpdateSettingsKey",
                    id: selected()!,
                    key,
                    value,
                  });

                return (
                  <Switch fallback={`Cannot edit type ${type()}`}>
                    <Match when={widget().name === "textbox"}>
                      <span class="capitalize">{key}:</span>
                      <FormInput
                        label={""}
                        value={entry()!.value as string}
                        onChange={(ev) => apply(ev.currentTarget.value)}
                      />
                    </Match>
                    <Match when={widget().name === "textarea"}>
                      <span class="capitalize">{key}:</span>
                      <textarea
                        value={entry()!.value as string}
                        onChange={(ev) => apply(ev.currentTarget.value)}
                      />
                    </Match>
                    <Match when={widget().name === "checkbox"}>
                      <span class="capitalize">{key}:</span>
                      <label
                        class={`group inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          entry()!.value
                            ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                            : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        {entry()!.value ? "True" : "False"}
                        <input
                          type="checkbox"
                          checked={entry()!.value as boolean}
                          onChange={(ev) => apply(ev.currentTarget.checked)}
                          class="sr-only"
                        />
                      </label>
                    </Match>
                    <Match when={widget().name === "numberbox"}>
                      <span class="capitalize">{key}:</span>
                      <FormInput
                        label={""}
                        type="number"
                        value={entry()!.value as number}
                        onChange={(ev) => apply(ev.currentTarget.valueAsNumber)}
                      />
                    </Match>
                    <Match when={widget().name === "dropdown"}>
                      <span class="capitalize">{key}:</span>
                      <select
                        value={entry()!.value}
                        onChange={(ev) => apply(ev.currentTarget.value)}
                        class="text-black capitalize bg-white/80 p-1 rounded-sm hover:bg-white/100"
                      >
                        <For each={(widget() as { options: string[] }).options}>
                          {(option) => (
                            <option class="capitalize">{option}</option>
                          )}
                        </For>
                      </select>
                    </Match>
                  </Switch>
                );
              }}
            </For>
          </div>
          <button
            data-testid="delete_node_button"
            class="bg-red-600 rounded-lg flex z-10 items-center justify-center font-bold text-white m-2 pt-1 pb-1"
            onClick={() => {
              props.updateGraph({ type: "DeleteNode", id: selected()! });
            }}
          >
            Delete Node
          </button>
        </Match>
      </Switch>

      <Show when={showExecute()}>
        <ExecuteModal
          onHide={() => setShowExecute(false)}
          execute={(data) =>
            props.execute(webhookExecuteNodeId()!, JSON.parse(data))
          }
        />
      </Show>
    </div>
  );
}
