import { JSX, Match, Switch } from "solid-js";
import { useSelfSelected } from "../editor/InteractiveCanvas";
import getTextColour from "~/components/shared/TextColour";
import { Icons_Dict } from "../shared/NodeIcons";
import { FaSolidCircleQuestion } from "solid-icons/fa";
/**
 * Node signifying given data is processed
 */
export function ProcessNode(props: {
  title: JSX.Element;
  displayName: JSX.Element;
  children?: JSX.Element;
}) {
  const isSelected = useSelfSelected();
  const IconFetch = Icons_Dict[props.title as keyof typeof Icons_Dict];
  console.log(props.title);
  const Icon = (
    <Switch
      fallback={
        <div>
          <FaSolidCircleQuestion size={40} fill="red-700" />
        </div>
      }
    >
      <Match when={IconFetch}>
        <IconFetch size={40} />
      </Match>
    </Switch>
  );

  const sharedContent = (
    <div class="group flex-1 p-2 flex-col items-center justify-center text-center">
      <div class="flex items-center justify-center gap-2">{Icon}</div>
      <p class="flex-col font-bold text-black select-none text-xl font-mono capitalize">
        {props.displayName}
      </p>
      <div class="flex flex-col items-center justify-center gap-2 w-full">
        {props.children}
      </div>
    </div>
  );

  return (
    <Switch
      fallback={
        <div
          data-testid="process_node"
          class={`group relative w-max rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center`}
        >
          {sharedContent}
        </div>
      }
    >
      <Match when={isSelected?.()}>
        <div
          data-testid="process_node"
          class={`group relative w-max rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center outline outline-4 outline-indigo-500`}
        >
          {sharedContent}
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
    <div class="flex-col flex-1 p-2 min-h-fit w-full rounded-[35px] bg-neutral-800 flex align-text-top justify-center place-content-stretch text-white font-bold capitalize">
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
        <div class="rounded-t-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col pl-6 pr-6 pt-2 pb-2">
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
        <div class="rounded-t-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col outline outline-4 outline-indigo-600 pl-6 pr-6 pt-2 pb-2">
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
        <div class="rounded-b-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col p-2 pb-12">
          <div class="flex flex-col text-center items-center">
            <p class="flex-col font-bold text-white select-none text-2xl capitalize pt-2">
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
        <div class="rounded-b-full relative w-max h-max bg-slate-600 flex items-center justify-center flex-col outline outline-4 outline-indigo-600 p-2 pb-12">
          <div class="flex flex-col text-center items-center">
            <p class="flex-col font-bold text-white select-none text-2xl capitalize pt-2">
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
