import { Graph } from "~/lib/types";
import { For, Match, Switch, useContext } from "solid-js";
import { SelectedElementContext } from "../editor/InteractiveCanvas";
import { FormInput } from "../forms/FormInput";
import { GraphAction } from "./FlowEditor";
import { FaSolidXmark } from "solid-icons/fa";

interface SidebarProps {
  graph: Graph;
  updateGraph: (action: GraphAction) => void;
}

export function SettingsSidebar(props: SidebarProps) {
  const [selected] = useContext(SelectedElementContext)!;
  const node = () =>
    selected()
      ? props.graph.nodes.find((node) => node.id === selected())
      : undefined;

  return (
    <Switch
      fallback={
        <div class="h-full bg-neutral-700 w-[360px]">
          <h1 class="text-white text-2xl text-center bg-slate-600 rounded-md mt-2 ml-1 mr-1 mb-2 font-mono">
            Node Settings
          </h1>
          <hr class="border-t-2 my-2 mx-2" />
          <div class="text-white grid place-items-center">Select a node</div>
        </div>
      }
    >
      <Match when={node()}>
        <div class="h-full bg-neutral-700 w-[360px]">
          <h1 class="text-white text-2xl text-center bg-indigo-500 rounded-md mt-2 ml-1 mr-1 mb-2 font-mono">
            Node Settings
          </h1>
          <hr class="border-t-2 my-2 mx-2" />
          <div class=" text-white flex flex-col gap-4 p-4">
            <span class="text-xl">{node()!.type}</span>
            <span class="text-xs select-all">{selected()}</span>
            <For each={Object.keys(node()!.settings)}>
              {(key) => {
                const entry = () => node()!.settings[key];
                const type = () => entry().type;

                const apply = (value: any) =>
                  props.updateGraph({
                    type: "UpdateSettingsKey",
                    id: selected()!,
                    key,
                    value,
                  });

<<<<<<< HEAD
              return (
                <Switch fallback={`Cannot edit type ${type()}`}>
                  <Match when={type() === "string"}>
                    <FormInput
                      label={key}
                      value={entry()!.value as string}
                      onChange={(ev) => apply(ev.currentTarget.value)}
                    />
                  </Match>
                  <Match when={type() === "boolean"}>
                    <span>{key}</span>
                    <input
                      type="checkbox"
                      checked={entry()!.value as boolean}
                      onChange={(ev) => apply(ev.currentTarget.checked)}
                    />
                  </Match>
                  <Match when={type() === "number"}>
                    <span>{key}</span>
                    <FormInput
                      label={key}
                      type="number"
                      value={entry()!.value as number}
                      onChange={(ev) => apply(ev.currentTarget.valueAsNumber)}
                    />
                  </Match>
                </Switch>
              );
            }}
          </For>
          <button
            data-testid="delete_node_button"
            class="bg-red-600 p-2 rounded-lg flex z-10 items-center justify-center font-bold "
            onClick={() => {
              props.updateGraph({ type: "DeleteNode", id: selected()! });
            }}
          >
            Delete Node
          </button>
=======
                return (
                  <Switch fallback={`Cannot edit type ${type()}`}>
                    <Match when={type() === "string"}>
                      <span class="capitalize">{key}:</span>
                      <FormInput
                        label={""}
                        value={entry()!.value as string}
                        onChange={(ev) => apply(ev.currentTarget.value)}
                      />
                    </Match>
                    <Match when={type() === "boolean"}>
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
                    <Match when={type() === "number"}>
                      <span class="capitalize">{key}:</span>
                      <FormInput
                        label={""}
                        type="number"
                        value={entry()!.value as number}
                        onChange={(ev) => apply(ev.currentTarget.valueAsNumber)}
                      />
                    </Match>
                  </Switch>
                );
              }}
            </For>
            <hr class="border-t-2 my-2" />
            <button
              class="bg-red-600 p-2 rounded-lg flex z-10 items-center justify-center font-bold"
              onClick={() => {
                props.updateGraph({ type: "DeleteNode", id: selected()! });
              }}
            >
              Delete Node
            </button>
          </div>
>>>>>>> master
        </div>
      </Match>
    </Switch>
  );
}
