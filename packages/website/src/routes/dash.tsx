  import {
    Square_New,
    Square_File
  } from "~/components/dashboard/squares";
  
  export default function Home() {
    return (
        <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
          <div class="flex">
            <div class="mr-5">
            <Square_New />
            </div>
            <Square_File title="Title of me" description="Look at my description" />
          </div>
        </div>
    
    );
  }
  