import type { JSX } from "solid-js";

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
            "w-full px-6 pt-2.5 pb-2 bg-green-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
          }
        >
          {props.children}
        </button>
      </div>
    </div>
  );
}

/**
 * Danger Button Component
 */
export function Button_Danger(props: Props) {
  return (
    <div class="flex space-x-2 justify-center">
      <div>
        <button
          type="button"
          class={
            (props.class ?? "") +
            "w-full px-6 pt-2.5 pb-2 bg-red-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
          }
        >
          {props.children}
        </button>
      </div>
    </div>
  );
}

/**
 * Info Button Component
 */
export function Button_Primary(props: Props) {
  return (
    <div class="flex space-x-2 justify-center">
      <div>
        <button
          type="button"
          class={
            (props.class ?? "") +
            "w-full px-6 pt-2.5 pb-2 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
          }
        >
          {props.children}
        </button>
      </div>
    </div>
  );
}

/**
 * Option Button Component
 */
export function Button_Option(props: Props) {
  return (
    <div class="flex space-x-2 justify-center">
      <div>
        <button
          type="button"
          class={
            (props.class ?? "") +
            "w-full px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-normal uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          }
        >
          {props.children}
        </button>
      </div>
    </div>
  );
}
