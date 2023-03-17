import { FaSolidCircleQuestion } from "solid-icons/fa";
import { Icons_Dict } from "../shared/NodeIcons";

export function NodeTypeDrag(props: { name: string }) {
  const Icon =
    Icons_Dict[props.name as keyof typeof Icons_Dict] || FaSolidCircleQuestion;
  return (
    <div class="flex text-w-full text-md font-mono rounded-md border-4 place-content-center bg-white justify-items-center items-center gap-2 pl-1 overflow-hidden">
      <Icon size={20} />
      <p class="font-bold flex-grow">{props.name}</p>
    </div>
  );
}
