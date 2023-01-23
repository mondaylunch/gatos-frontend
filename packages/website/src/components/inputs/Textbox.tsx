import type { JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLInputElement>;

/**
 * Common textbox element
 */
export function Textbox(props: Props) {
    return <input {...props} class="bg-gray-200 p-4" />;
}
