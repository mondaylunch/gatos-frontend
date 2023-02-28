import { grabSource } from "../editor/directives/grabSource";
import { VariableNode } from "./Node";

grabSource;

export function NodeSidebar() {
  return (
    <div class="w-[240px] bg-neutral-700">
      <VariableNode name="variable" />
    </div>
  );
}
