import { Action_Node } from "~/components/nodes/Node";
  
  export default function Home() {
    return (
        <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
          <div class="flex">
            <div class="mr-5">
            <Action_Node />
            </div>
          </div>
        </div>
    
    );
  }
  