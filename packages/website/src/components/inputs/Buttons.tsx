import type { JSX } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: keyof typeof VARIANTS;
};

/**
 * Common classes for all buttons
 */
const BASE =
  "w-full px-6 font-medium text-xs leading-normal uppercase rounded focus:outline-none focus:ring-0 transition duration-150 ease-in-out flex align-center";

/**
 * Shadow modifier classes
 */
const WITH_SHADOW =
  "shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg";

/**
 * Border modifier classes
 */
const SIZE = {
  FILL: "pt-2.5 pb-2",
  HOLLOW: "py-2 border-2",
};

/**
 * Variants of button styles
 */
const VARIANTS = {
  success: `${BASE} ${SIZE.FILL} ${WITH_SHADOW} bg-green-600 text-white hover:bg-green-700 focus:bg-green-700 active:bg-green-800`,
  primary: `${BASE} ${SIZE.FILL} ${WITH_SHADOW} bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800`,
  danger: `${BASE} ${SIZE.FILL} ${WITH_SHADOW} bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 active:bg-red-800`,
  option: `${BASE} ${SIZE.HOLLOW} border-blue-600 text-blue-600 hover:bg-black hover:bg-opacity-5`,
};

/**
 * Common button component
 */
export function Button(props: Props) {
  return (
    <div class="flex space-x-2 justify-center">
      <div>
        <button
          {...props}
          class={`${props.class ?? ""} ${VARIANTS[props.variant]}`}
        />
      </div>
    </div>
  );
}
