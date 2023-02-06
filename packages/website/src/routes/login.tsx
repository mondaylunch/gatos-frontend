import { Button } from "~/components/inputs/Buttons";
import { Email_Textbox, Password_Textbox } from "~/components/inputs/Textbox";
import "./index.css";

export default function Home() {
  return (
    <div class="flex h-screen w-screen items-center justify-center bg-neutral-900">
      <div class="block pt-6 pr-6 pl-6 pb-4 rounded-[35px] shadow-lg max-w-sm bg-neutral-800">
        <div class="pb-2">
          <Email_Textbox id="email" />
        </div>
        <div class="py-2">
          <Password_Textbox id="password">Password</Password_Textbox>
        </div>
        <div class="py-2">
          <div class="flex space-x-2 justify-center">
            <a href="/login">
              {" "}
              {/*Needs to point to function */}
              <Button variant="primary">Log in</Button>
            </a>
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
    </div>
  );
}
