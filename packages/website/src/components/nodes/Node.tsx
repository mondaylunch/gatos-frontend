import { JSX } from "solid-js";

export function Action_Node(props: { children?: JSX.Element }) {
  return (
    <div class="group relative h-32 w-72 rounded-[35px] bg-white flex align-text-top items-center justify-center align-items-center">
      <div class="flex flex-col text-center items-center text-black">
        <p class="font-bold capitalize select-none">Concatenate</p>
        <div class="flex-col w-60 h-16 rounded-[35px] bg-neutral-800 flex align-text-top justify-center">
          {props.children}
        </div>
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
    <div class="rounded-t-full h-32 w-64 flex bg-neutral-900 flex items-center justify-center">
      <p class="font-bold text-white select-none">HTTP request</p>
    </div>
  );
}

export function End_Node() {
  return (
    <div class="rounded-b-full h-32 w-64 flex bg-neutral-900 flex items-center justify-center">
      <p class="font-bold text-white select-none">OUTPUT</p>
    </div>
  );
}

<div class="group relative w-72 h-32 rounded-[35px] bg-white flex align-text-top justify-center">
  <p class="font-bold capitalize select-none">Concatenate</p>
  <div class="flex-col w-60 h-28 rounded-[35px] bg-neutral-800 flex align-text-top justify-center"></div>
</div>;
