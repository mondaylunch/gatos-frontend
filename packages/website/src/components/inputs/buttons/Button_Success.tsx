import type { JSX } from "solid-js";
import "../../icons.css";

type Props = JSX.HTMLAttributes<HTMLButtonElement>;

/**
 * Success Button Component
 */
export function Button_Success(props: Props) {
  return (
    <div class="flex space-x-2 justify-center">
      <div>
        <button
          type="button"
          class={
            (props.class ?? "") +
            "px-6 pt-2.5 pb-2 bg-green-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
          }
        >
          {props.children}
        </button>
      </div>
    </div>
  );
}
