import { Square_New, Square_File } from "~/components/dashboard/squares";
import { For, createSignal } from "solid-js";

const [flows, setFlows] = createSignal([] as Flow[]);

type Flow = {
  id: string;
  name: string;
  authorId: string;
};

function loadFlows() {
  fetch("http://localhost:4391/api/v1/flows/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Replace with token from logged in user
      "x-auth-token": "264cd8ca-8902-4516-8c53-71e2feea0093",
    },
  })
    .then((response) => response.json() as Promise<Flow[]>)
    .then((flows) => {
      if (!isNaN(flows.length)) {
        setFlows(flows);
      }
    });
}

export default function Dash() {
  loadFlows();
  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
      <div class="flex">
        <div class="mr-5">
          <Square_New />
        </div>
        <For each={flows()}>
          {(flow) => (
            <Square_File title={flow.name} description="My description" />
          )}
        </For>
      </div>
    </div>
  );
}
