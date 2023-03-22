import { JSX, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FormInput(props: Props) {
  const [local, remote] = splitProps(props, ["name", "label"]);

  return (
    <div class="relative z-0">
      <input
        required
        {...remote}
        name={local.name}
        class="block py-2.5 px-0 w-full text-sm text-slate-200 bg-transparent border-0 border-b-2 border-slate-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      />
      <label
        for={local.name}
        class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {local.label}
      </label>
    </div>
  );
}
