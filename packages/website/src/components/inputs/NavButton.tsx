import type { JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLAnchorElement>;

export function NavButton(props: Props) {
  return <a {...props} class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0" />;
}