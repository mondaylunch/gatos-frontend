import { useForm } from "~/components/forms/useLoginForm";
import { Button } from "~/components/inputs/Buttons";
import "./index.css";

export default function Home() {
  const { form, submit, updateFormField, clearField } = useForm();

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    submit(form);
  };
  return (
    <div class="flex h-screen w-screen items-center justify-center bg-neutral-900">
      <form onSubmit={handleSubmit}>
        <div class="block pt-6 pr-6 pl-6 pb-4 rounded-[35px] shadow-lg max-w-sm bg-neutral-800">
          <div class="pb-2">
          <div class="relative z-0">
            <input
              type="email"
              id="email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={form.email}
              onInput={updateFormField("email")}
            />
            <label
              for="email"
              class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          </div>
          <div class="py-2">
            <div class="relative z-0">
              <input
                type="password"
                id="password"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.password}
                onInput={updateFormField("password")}
              />
              <label
                for="password"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
          </div>
          <div class="py-2">
            <div class="flex space-x-2 justify-center">
              <Button
                  variant="primary"
                  class="form-submit submit"
                  type="submit"
                >
                  Log in
                </Button>
              <a href="/signup">
                <Button variant="option">Sign up</Button>
              </a>
            </div>
            <div class="pt-2">
              <a
                class="text-gray-500 text-sm hover:underline transition duration-150 ease-in-out"
                href="#!"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
