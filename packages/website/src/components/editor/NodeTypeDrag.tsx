import { Match, Switch } from "solid-js";
import { FaSolidCircleQuestion } from "solid-icons/fa";
import { Icons_Dict } from "../shared/NodeIcons";

export function NodeTypeDrag(props: { name: string }) {
  const Icon = Icons_Dict[props.name as keyof typeof Icons_Dict];
  return (
    <div class="flex text-w-full rounded-[30px] border-4 place-content-center bg-white justify-items-center items-center gap-2 pl-1 overflow-hidden">
      <Switch
        fallback={
          <div>
            <FaSolidCircleQuestion size={20} fill="red-700" />
            <p class="font-bold flex-grow">{props.name}</p>
          </div>
        }
      >
        <Match when={props.name in Icons_Dict}>
          <Icon size={20} />
          <p class="font-bold flex-grow">{props.name}</p>
        </Match>
      </Switch>
    </div>
  );
}
