import type { JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLInputElement>;

/**
 * Common hidden textbox element
 */
export function Hidden_Textbox(props: Props) {
    return <input {...props} class="hidden" />;
}