import {
  Show,
  createSignal,
  createEffect,
  onCleanup,
  Switch,
  Match,
} from "solid-js";
import { FaSolidCat } from "solid-icons/fa";
import { A, useLocation } from "solid-start";
import { signIn, signOut } from "@auth/solid-start/client";
import { user } from "~/lib/session";

export function Navbar() {
  const [dropdownVisible, setDropdownVisible] = createSignal(false);
  const location = useLocation();

  function toggleDropdown() {
    setDropdownVisible(!dropdownVisible());
  }

  createEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownVisible()) {
        setDropdownVisible(false);
      }
    }

    if (dropdownVisible()) {
      document.addEventListener("click", handleOutsideClick);

      onCleanup(() =>
        document.removeEventListener("click", handleOutsideClick)
      );
    }
  });

  return (
    <nav class="bg-indigo-600">
      <div class="mx-auto max-w-7xl px-2">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-stretch justify-start">
            <div class="flex items-center pr-2">
              <A href="/">
                <img
                  src="/images/gatosLogoSmall.png"
                  class="w-8 h-8 object-contain rounded-[45px]"
                  alt="Flow image"
                />
              </A>
            </div>
            <Switch
              fallback={
                <div class="flex space-x-4">
                  <button
                    class={`${
                      location.pathname === "/login"
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
                    onClick={() => signIn("auth0")}
                  >
                    Login or Sign Up
                  </button>
                </div>
              }
            >
              <Match when={user()}>
                <div>
                  <div class="flex space-x-4">
                    <A
                      class={`${
                        location.pathname === "/dash"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
                      href="/dash"
                    >
                      Dashboard
                    </A>
                    <A
                      class={`${
                        location.pathname === "/"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
                      href="/"
                    >
                      About
                    </A>

                    <A
                      class={`${
                        location.pathname === "/help"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
                      href="https://docs.mondaylunch.club/"
                      target="_blank"
                    >
                      Help
                    </A>
                  </div>

                  <div class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <div>
                      <button onClick={toggleDropdown}>
                        <span class="sr-only">Open user menu</span>
                        <img
                          class="h-12 w-12 rounded-full"
                          src={
                            user()!.avatar ??
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          alt=""
                        />
                      </button>
                      <Show when={dropdownVisible()}>
                        <div
                          class="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-500 whitespace-nowrap"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu-button"
                          tabindex="-1"
                        >
                          <a
                            href="#"
                            class="block px-4 py-2 text-xl text-gray-700 font-bold text-right hover:bg-gray-300 transition ease-in-out duration-150"
                            role="menuitem"
                            tabindex="-1"
                            id="user-menu-item-0"
                          >
                            Hi {user()!.username}!
                          </a>
                          <button
                            onClick={() => signOut()}
                            class="block px-4 py-2 w-full text-sm text-gray-700 text-right hover:bg-gray-300 transition ease-in-out duration-150"
                            role="menuitem"
                            tabindex="0"
                            id="user-menu-item-1"
                          >
                            Logout
                          </button>
                        </div>
                      </Show>
                    </div>
                  </div>
                </div>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </nav>
  );
}
