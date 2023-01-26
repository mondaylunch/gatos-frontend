import {
  Button_Success,
  Button_Danger,
  Button_Option,
  Button_Primary,
} from "~/components/inputs/Buttons";
import { Email_Textbox, Password_Textbox } from "~/components/inputs/Textbox";
import "./index.css";

export default function Home() {
  return (
<div class="bg-gradient-to-br from-indigo-600 to-teal-500 min-h-screen flex flex-col justify-center items-center">
  <h1 class="text-3xl font-medium text-center text-white mb-6">Temporary</h1>
  <div class="w-full max-w-md">
    <div class="bg-white p-6 rounded-[35px] shadow-md flex justify-center">
    <a class="w-full mr-2" href="/login">
    <button class="w-full mr-2 bg-indigo-500 text-white p-3 rounded-[20px] hover:bg-indigo-600">
          Log in
        </button>
    </a>
      <a class="w-full" href="/signup">
        <button class="w-full bg-indigo-500 text-white p-3 rounded-[20px] hover:bg-indigo-600">
          Sign Up
         </button>
    </a>
    </div>
  </div>
</div>
  );
}
