import { JSX } from "solid-js";

/**
 * Node signifying given data is processed
 */
export function ProcessNode(props: {
  title: JSX.Element;
  children?: JSX.Element;
}) {
  return (
    <div class="group relative h-32 w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center">
        <div class="flex flex-col items-center justify-center">
            {props.children}
        </div>
    </div>
  );
}

/**
 * Node input drop area
 */
export function VariableDropZone(props: { children?: JSX.Element }) {
  return (
    <div class="flex-col p-2 min-h-fit rounded-[35px] bg-neutral-800 flex align-text-top justify-center">
      {props.children}
    </div>
  );
}

/**
 * Node variable
 */
export function VariableNode(props: { name: JSX.Element }) {
  return (
    <div class="text-white group relative w-fit p-4 h-8 rounded-[35px] bg-rose-500 flex items-center justify-center">
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
      <div
          class="rounded-b-full group relative h-32 w-72 rounded-[35px] bg-neutral-900 flex align-text-top items-center justify-center align-items-center">
          <div class="flex flex-col text-center items-center text-white">
              {props.children}
          </div>
      </div>

  );
}
