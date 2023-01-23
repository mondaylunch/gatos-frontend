import type { JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLButtonElement>;

/**
 * Common Button element
 */
export function Button(props: Props) {
  return <button {...props} class="bg-red-500 p-4" />;
}
