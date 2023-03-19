import { signIn } from "@auth/solid-start/client";

import { Navbar } from "~/components/shared/Navbar";

export default function Home() {
  const login = () => signIn("auth0");

  return (
    <div>
      <Navbar />
      <div class="bg-neutral-900 min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-black">
        <span class="text-6xl font-semibold mb-1 text-white">
            Welcome to
          </span>
        <span class="text-9xl font-semibold mb-20 text-blue-500" style="background: linear-gradient(-45deg, #eca100, #ec540d, #f44653, #4d58c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            GATOS
          </span>
        <div class="gradient-text text-4xl font-bold">


        </div>
        <div class="w-full max-w-md">
          <div class="bg-white p-6 rounded-[35px] shadow-md flex justify-center">
            <button
              type="button"
              onClick={login}
              class="w-full mr-2 bg-indigo-500 text-white p-3 rounded-[20px] hover:bg-indigo-600"
            >
              Log in or Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
