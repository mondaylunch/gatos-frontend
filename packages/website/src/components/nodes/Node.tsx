import {JSX} from "solid-js";

type Props = {
    children?: JSX.Element;
}

export function Action_Node(props: Props) {
  return (
    <div class="group relative h-32 w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center">
      <div class="flex flex-col text-center items-center text-black">
        <p class="font-bold capitalize select-none">Concatenate</p>
        {/*<div class="flex-col w-60 h-16 rounded-[35px] bg-neutral-800 flex align-text-top justify-center"></div>*/}
          {props.children}
      </div>
    </div>
  );
}

export function Variable_Node() {
  return (
    <div class="text-white group relative w-28 h-8 rounded-[35px] bg-rose-500 flex items-center justify-center">
      <p class="font-bold select-none">name</p>
    </div>
  );
}

export function Start_Node() {
  return (
    <div class="rounded-t-full h-32 w-64 flex bg-neutral-900 m-2 flex items-center justify-center">
      <p class="font-bold text-white select-none">HTTP request</p>
    </div>
  );
}

export function End_Node() {
  return (
    <div class="rounded-b-full h-32 w-64 flex bg-neutral-900 m-2 flex items-center justify-center">
      <p class="font-bold text-white select-none">OUTPUT</p>
    </div>
  );
}
