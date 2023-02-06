import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";
import "./temp.css";

import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd";
import { Accessor, createSignal, For, Match, Show, Switch } from "solid-js";

const Draggable = () => {
  const draggable = createDraggable(1);
  return (
    <div
      // @ts-expect-error a
      use:draggable
      class="draggable"
    >
      Draggable
    </div>
  );
};

const Droppable = (props: any) => {
  const droppable = createDroppable(1);
  return (
    <div
      // @ts-expect-error a
      use:droppable
      class="droppable"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
    >
      Droppable.
      {props.children}
    </div>
  );
};

function allElementsFromPoint(x: number, y: number) {
  // https://stackoverflow.com/a/27884653
  var element,
    elements = [];
  var old_visibility = [];
  while (true) {
    element = document.elementFromPoint(x, y) as HTMLElement;
    if (!element || element === document.documentElement) {
      break;
    }
    elements.push(element);
    old_visibility.push(element.style.visibility);
    element.style.visibility = "hidden"; // Temporarily hide the element (without changing the layout)
  }
  for (var k = 0; k < elements.length; k++) {
    elements[k].style.visibility = old_visibility[k];
  }
  elements.reverse();
  return elements;
}

export default function Home() {
  const [move, setMove] = createSignal(false);
  const [grabbed, setGrabbed] = createSignal(false);
  const [x, setX] = createSignal(100);
  const [y, setY] = createSignal(100);
  const [virtualX, setVX] = createSignal(350);
  const [virtualY, setVY] = createSignal(100);
  const [dropped, setDropped] = createSignal([] as number[]);

  let zoomRef: Accessor<number> | undefined;

  return (
    <main
      class={styles.container + " select-none"}
      onMouseMove={(e) => {
        if (move()) {
          setX((x) => x + e.movementX / zoomRef!());
          setY((y) => y + e.movementY / zoomRef!());
        }

        if (grabbed()) {
          setVX((x) => x + e.movementX / zoomRef!());
          setVY((y) => y + e.movementY / zoomRef!());
        }
      }}
    >
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
      <Canvas zoomRef={(ref) => (zoomRef = ref)}>
        <CanvasElement x={x()} y={y()} width={200} height={200}>
          <div
            style="background: gray"
            onMouseDown={() => setMove(true)}
            onMouseUp={() => setMove(false)}
          >
            text
            <div
              style="background: black; color: white; width: 128px; height: 128px; display: flex; flex-wrap: wrap;"
              id="yes"
            >
              <Switch fallback={<>A</>}>
                <Match when={dropped().length}>
                  <For each={dropped()}>
                    {() => (
                      <div style="background: red; height: 48px;">var</div>
                    )}
                  </For>
                </Match>
              </Switch>
            </div>
          </div>
        </CanvasElement>
        <CanvasElement x={350} y={100} width={100} height={100}>
          <div style="background: red" onMouseDown={() => setGrabbed(true)}>
            arbitrary variable
          </div>
        </CanvasElement>
        <Show when={grabbed()}>
          <CanvasElement x={virtualX()} y={virtualY()} width={100} height={100}>
            <div
              style="background: red"
              onMouseUp={(ev) => {
                setGrabbed(false);
                setVX(350);
                setVY(100);

                const els = document.querySelectorAll("svg > *");
                for (const el of els) {
                  const droppable = el.querySelector("#yes");
                  if (droppable) {
                    const pos = droppable.getBoundingClientRect();
                    if (
                      ev.clientX > pos.left &&
                      ev.clientX < pos.right &&
                      ev.clientY > pos.top &&
                      ev.clientY < pos.bottom
                    ) {
                      setDropped((x) => [...x, 0]);
                    }
                  }
                }
              }}
            >
              arbitrary variable
            </div>
          </CanvasElement>
        </Show>
      </Canvas>
    </main>
  );
}
