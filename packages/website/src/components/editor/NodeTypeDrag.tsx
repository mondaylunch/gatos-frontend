import { FaSolidCircleQuestion } from "solid-icons/fa";
import { Icons_Dict } from "../shared/NodeIcons";
import { getDisplayName } from "~/lib/types";
import { Match, Switch } from "solid-js";

export function NodeTypeDrag(props: { name: string }) {
  const Icon = Icons_Dict[props.name as keyof typeof Icons_Dict];
  const displayName = getDisplayName("node_type", props.name);
  return (
    <div class="flex text-w-full text-md rounded-md border-4 place-content-center bg-white justify-items-center items-center gap-2 pl-1 overflow-hidden">
      <Switch
        fallback={
          <div>
            <FaSolidCircleQuestion size={20} fill="red-700" />
            <p class="font-bold flex-grow">{displayName}</p>
          </div>
        }
      >
        <Match when={props.name in Icons_Dict}>
          <Icon size={20} />
          <p class="font-bold flex-grow">{displayName}</p>
        </Match>
      </Switch>
    </div>
  );
}
