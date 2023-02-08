import { Show } from "solid-js";
import { createServerAction$, redirect } from "solid-start/server";
import { FormInput } from "~/components/forms/FormInput";
import { Button } from "~/components/inputs/Buttons";
import { login, storage } from "~/lib/session";
import "./index.css";

export default function Login() {
  const [form, { Form }] = createServerAction$(async (form: FormData) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const user = await login({
      email,
      password,
    });

    const session = await storage.getSession();
    session.set("authToken", user.authToken);

    return redirect("/dash", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-neutral-900">
      <Form>
        <div class="block pt-6 pr-6 pl-6 pb-4 rounded-[35px] shadow-lg max-w-sm bg-neutral-800">
          <div class="pb-2">
            <FormInput
              type="email"
              name="email"
              minLength={2}
              label="Email Address"
            />
          </div>
          <div class="py-2">
            <FormInput
              minLength={8}
              type="password"
              name="password"
              label="Password"
            />
          </div>
          <Show when={form.error}>{form.error}</Show>
          <div class="py-2">
            <div class="flex space-x-2 justify-center">
              <Button
                type="submit"
                variant="primary"
                class="form-submit submit"
              >
                Log in
              </Button>
              <a href="/signup">
                <Button type="button" variant="option">
                  Sign up
                </Button>
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
      </Form>
    </div>
  );
}
