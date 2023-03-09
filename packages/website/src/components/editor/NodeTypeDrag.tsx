import type { JSX } from "solid-js";
import { Match, Switch } from "solid-js";
import {
  FaSolidArrowsLeftRight,
  FaSolidBox,
  FaSolidCalculator,
  FaSolidEquals,
  FaSolidGreaterThanEqual,
  FaSolidMagnifyingGlass,
  FaSolidSkullCrossbones,
  FaSolidToggleOn,
  FaSolidUpRightFromSquare,
  FaSolidCircleExclamation,
  FaSolidArrowRight,
  FaSolidArrowLeft,
  FaSolidQuoteLeft,
  FaSolidDownLeftAndUpRightToCenter,
  FaSolidSignsPost,
  FaSolidRuler,
  FaSolidCircleCheck,
  FaSolidTriangleExclamation,
  FaSolidGlobe,
  FaSolidCircleQuestion,
} from "solid-icons/fa";

const Icons_Dict = {
  list_length: FaSolidArrowsLeftRight,
  variable_extraction: FaSolidUpRightFromSquare,
  string_interpolation: FaSolidQuoteLeft,
  http_request: FaSolidGlobe,
  is_nan: FaSolidTriangleExclamation,
  truthiness: FaSolidCircleCheck,
  variable_remapping: FaSolidSignsPost,
  string_length: FaSolidRuler,
  string_concat: FaSolidDownLeftAndUpRightToCenter,
  list_head_separation: FaSolidArrowLeft,
  is_finite: FaSolidSkullCrossbones,
  list_tail_separation: FaSolidArrowRight,
  negation: FaSolidCircleExclamation,
  equals: FaSolidEquals,
  string_contains: FaSolidMagnifyingGlass,
  number_comparison: FaSolidGreaterThanEqual,
  math: FaSolidCalculator,
  boolean_operation: FaSolidToggleOn,
  optional_or_else: FaSolidBox,
};

export function NodeTypeDrag(props: { name: string }) {
  const Icon = Icons_Dict[props.name as keyof typeof Icons_Dict];
  return (
    <div class="flex text-w-full rounded-[30px] border-4 place-content-center bg-white justify-items-center items-center gap-2 pl-1">
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
