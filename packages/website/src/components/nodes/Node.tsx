import { JSX, Show, Match, Switch } from "solid-js";
import { useSelfSelected } from "../editor/InteractiveCanvas";
import getTextColour from "~/components/shared/TextColour";
/**
 * Node signifying given data is processed
 */
export function ProcessNode(props: {
  title: JSX.Element;
  children?: JSX.Element;
}) {
  const isSelected = useSelfSelected();
  return (
    <Switch
      fallback={
        <div
          class={`group relative w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center`}
        >
          <div class="group flex-1 p-4 flex-col items-center justify-center text-left">
            <p class="flex-col font-bold text-black select-none">
              {props.title}
            </p>
            {props.children}
          </div>
        </div>
      }
    >
      <Match when={isSelected?.()}>
        <div
          class={`group relative w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center outline outline-4 outline-indigo-500`}
        >
          <div class="group flex-1 p-4 flex-col items-center justify-center text-left">
            <p class="flex-col font-bold text-black select-none">
              {props.title}
            </p>
            {props.children}
          </div>
        </div>
      </Match>
    </Switch>
  );
}

/**
 * Node input drop area
 */
export function VariableDropZone(props: { children?: JSX.Element }) {
  return (
    <div class="flex-col flex-1 p-2 min-h-fit w-full rounded-[35px] bg-neutral-800 flex align-text-top justify-center place-content-stretch">
      {props.children}
    </div>
  );
}

/**
 * Node variable
 */
export function VariableNode(props: { name: JSX.Element; id: string }) {
  const bgHue = parseInt(props.id.substring(0, 6), 16);
  return (
    <div
      class="p-4 h-8 rounded-[35px] flex items-center justify-center place-content-stretch"
      style={{
        background: `hsl(${bgHue}, 90%, 60%)`,
        color: `${getTextColour(bgHue)}`,
      }}
    >
      <p class="font-bold select-none">{props.name}</p>
    </div>
  );
}

/**
 * Node signifying the start of a flow
 */
export function InputNode(props: {
  title: JSX.Element;
  children?: JSX.Element;
}) {
  const isSelected = useSelfSelected();
  return (
    <Switch
      fallback={
        <div class="rounded-t-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col p-2">
          <div class="flex flex-col text-center items-center">
            <p class="flex-col font-bold text-white select-none text-2xl capitalize pt-4">
              {props.title}
            </p>
          </div>
          <div class="flex flex-col text-center items-center p-2 gap-2">
            {props.children}
          </div>
        </div>
      }
    >
      <Match when={isSelected?.()}>
        <div class="rounded-t-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col outline outline-4 outline-indigo-600 p-2">
          <div class="flex flex-col text-center items-center">
            <p class="flex-col font-bold text-white select-none text-2xl capitalize pt-4">
              {props.title}
            </p>
          </div>
          <div class="flex flex-col text-center items-center p-2 gap-2">
            {props.children}
          </div>
        </div>
      </Match>
    </Switch>
  );
}

/**
 * Node signifying the end of a flow
 */
export function OutputNode(props: { title: string; children?: JSX.Element }) {
  const isSelected = useSelfSelected();
  return (
    <Switch
      fallback={
        <div
          class={`rounded-b-full h-32 w-64 flex bg-neutral-900 items-center justify-center flex-col`}
        >
          <p class="flex-col font-bold text-white select-none">{props.title}</p>
          <div class="flex flex-col text-center items-center text-white">
            {props.children}
          </div>
        </div>
      }
    >
      <Match when={isSelected?.()}>
        <div
          class={`rounded-b-full h-32 w-64 flex bg-neutral-900 items-center justify-center flex-col outline outline-4 outline-indigo-500`}
        >
          <p class="flex-col font-bold text-white select-none">{props.title}</p>
          <div class="flex flex-col text-center items-center text-white">
            {props.children}
          </div>
        </div>
      </Match>
    </Switch>
  );
}
