import {
    Button_Option,
    Button_Primary,
  } from "~/components/inputs/Buttons";
  import { Email_Textbox, Password_Textbox } from "~/components/inputs/Textbox";
  import "./index.css";
  
  export default function Home() {
    return (
    
        <div class="flex h-screen w-screen items-center justify-center bg-slate-700">
            <div class="block pt-6 pr-6 pl-6 pb-4 rounded-lg shadow-lg bg-white max-w-sm bg-slate-800">
            
                <div class="pb-2">
                <Email_Textbox id="email" />
                </div>
                <div class="py-2">
                <Password_Textbox id="password" />
                </div>
                <div class="py-2">
                    <div class="flex space-x-2 justify-center">
                <Button_Primary>Log in</Button_Primary>
                <Button_Option>Sign up</Button_Option>
                </div>
                <div class="pt-2">
                <a class="text-gray-500 text-sm hover:underline transition duration-150 ease-in-out" href="#!">Forgot password?</a>
                </div>
                </div>
            </div>
        </div>
    );
  }
  