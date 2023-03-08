import { JSX, Show } from "solid-js";
import { useSelfSelected } from "../editor/InteractiveCanvas";

/**
 * Node signifying given data is processed
 */
export function ProcessNode(props: {
  title: JSX.Element;
  children?: JSX.Element;
}) {
  const isSelected = useSelfSelected();
  // TODO: indicate the node is selected

  return (
    <div
      class={`group relative h-32 w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center`}
    >
      <div class="flex-1 p-4 flex-col items-center justify-center text-left">
        <p class="flex-col font-bold text-black select-none">{props.title}</p>
        {props.children}
      </div>
      {/*<Show when={isSelected?.()}>i am selected</Show>*/}
    </div>
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
export function VariableNode(props: { name: JSX.Element }) {
  return (
    <div class="text-white p-4 h-8 rounded-[35px] bg-rose-500 flex items-center justify-center place-content-stretch">
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
  return (
    <div class="rounded-t-full h-32 w-64 flex bg-neutral-900 items-center justify-center flex-col">
      <p class="flex-col font-bold text-white select-none">{props.title}</p>
      <div class="flex flex-col text-center items-center text-white">
        {props.children}
      </div>
    </div>
  );
}

/**
 * Node signifying the end of a flow
 */
export function OutputNode(props: { title: string; children?: JSX.Element }) {
  return (
    <div class="rounded-b-full group relative h-32 w-72 rounded-[35px] bg-neutral-900 flex align-text-top items-center justify-center align-items-center">
      <div class="flex flex-col text-center items-center text-white">
        {props.children}
      </div>
    </div>
  );
}
