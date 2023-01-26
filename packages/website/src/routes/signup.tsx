import {
    Button_Option,
    Button_Primary,
  } from "~/components/inputs/Buttons";
  import { Email_Textbox, Password_Textbox, Username_Textbox } from "~/components/inputs/Textbox";
  import "./index.css";
  
  export default function Home() {
    return (
    
        <div class="flex h-screen w-screen items-center justify-center bg-slate-700">
            <div class="block pt-6 pr-6 pl-6 pb-4 rounded-lg shadow-lgmax-w-sm bg-slate-800">
            
                <div class="pb-2">
                <Username_Textbox id="username" />
                </div>
                <div class="py-2">
                <Email_Textbox id="email" />
                </div>
                <div class="py-2">
                <Password_Textbox id="password">Password</Password_Textbox>
                </div>
                <div class="py-2">
                <Password_Textbox id="password_confirm">Confirm Password</Password_Textbox>
                </div>
                <div class="py-2">
                    <div class="flex space-x-2 justify-center">
                 <a href="/signup"> {/*Needs to point to function */}
                    <Button_Primary>Sign up</Button_Primary> 
                </a>
                <a href="/login">
                    <Button_Option>Log in</Button_Option>
                </a>
                </div>

                </div>
            </div>
        </div>
    );
  }
  