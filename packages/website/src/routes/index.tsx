import { Button } from "~/components/inputs/Button";
import { NavButton } from "~/components/inputs/NavButton";
import { NavSpacer } from "~/components/inputs/NavSpacer";
import "./index.css";

export default function Home() {
  return (
    <main>
      <nav class="flex items-center justify-between flex-wrap bg-blue-400 p-6">
        <a href="/" class="flex items-center flex-shrink-0 text-white mr-6">
          <img src="/favicon.jpg" width={20} height={20}></img>
          <span class="font-bold text-xl tracking-tight">Gatos</span>
        </a>
        <div class="block lg:hidden">
          <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-blue-500 hover:text-white hover:border-white">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div class="text-sm lg:flex-grow">
            <a href="#balls" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Cool Link
            </a>
          </div>
          <div>
            <NavButton href="/signup">
              Sign Up
            </NavButton>
            <NavSpacer></NavSpacer>
            <NavButton href="/login">
              Log In
            </NavButton>
          </div>
        </div>
      </nav>
    </main>
  );
}
