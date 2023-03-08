import {signIn} from "@auth/solid-start/client";
export default function Home() {
    const login = () => signIn("auth0")

    return (
    <div class="bg-gradient-to-br from-indigo-600 to-teal-500 min-h-screen flex flex-col justify-center items-center">
      <h1 class="text-3xl font-medium text-center text-white mb-6">
        Temporary
      </h1>
      <div class="w-full max-w-md">
        <div class="bg-white p-6 rounded-[35px] shadow-md flex justify-center">
            <button type="button" onClick={login} class="w-full mr-2 bg-indigo-500 text-white p-3 rounded-[20px] hover:bg-indigo-600">
              Log in or Sign Up
            </button>
        </div>
      </div>
    </div>
  );
}
