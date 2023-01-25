import type { JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLInputElement>;

/**
 * Common textbox element
 */
export function Textbox(props: Props) {
  return <input {...props} class="bg-gray-200 p-4" />;
}

export function Hidden_Textbox(props: Props) {
  return <input {...props} class="hidden" />;
}

/**
 * Email textbox element
 * @param props
 * @returns Email textbox element with label
 */
export function Email_Textbox(props: Props) {
  return (
    <div class="relative z-0">
      <input
        type="email"
        id={props.id}
        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />
      <label
        for={props.id}
        class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Email address
      </label>
    </div>
  );
}

export function Password_Textbox(props: Props) {
  return (
    <div class="relative z-0">
      <input
        type="password"
        id={props.id}
        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />
      <label
        for={props.id}
        class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Password
      </label>
    </div>
  );
}
