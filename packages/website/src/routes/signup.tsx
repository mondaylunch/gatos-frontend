import { Show } from "solid-js";
import { createServerAction$, redirect } from "solid-start/server";
import { FormInput } from "~/components/forms/FormInput";
import { Button } from "~/components/inputs/Buttons";
import { register } from "~/lib/session";

export default function SignUp() {
  const [form, { Form }] = createServerAction$(async (form: FormData) => {
    const password = form.get("password") as string;
    const confirm_password = form.get("confirm-password") as string;

    if (password !== confirm_password) {
      throw "Passwords do not match";
    }

    const email = form.get("email") as string;
    const username = form.get("username") as string;

    await register({
      email,
      username,
      password,
    });

    return redirect("/login");
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-neutral-900">
      <div class="block pt-6 pr-6 pl-6 pb-4 rounded-[35px] shadow-lg max-w-sm bg-neutral-800">
        <Form>
          <div class="pb-2">
            <FormInput
              type="text"
              minLength={2}
              name="username"
              label="Username"
              pattern="[A-Za-z0-9-_]{2,32}"
            />
          </div>
          <div class="py-2">
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
          <div class="py-2">
            <FormInput
              minLength={8}
              type="password"
              name="confirm-password"
              label="Confirm Password"
            />
          </div>
          <Show when={form.error}>{form.error}</Show>
          <div class="py-2">
            <div class="flex space-x-2 justify-center">
              <Button
                type="submit"
                variant="primary"
                disabled={form.pending}
                class="form-submit submit"
              >
                Sign up
              </Button>
              <a href="/login">
                <Button type="button" variant="option">
                  Log in
                </Button>
              </a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
