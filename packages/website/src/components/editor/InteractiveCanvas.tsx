import {
  Accessor,
  ComponentProps,
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Canvas } from "./Canvas";
import { CanvasContext } from "./context";

type Props<MoveRef, GrabRef> = {
  /**
   * Content rendered in the canvas
   */
  children?: JSX.Element;

  /**
   * Children rendered before canvas element
   */
  preCanvas?: JSX.Element;

  /**
   * Children rendered after canvas element
   */
  postCanvas?: JSX.Element;

  /**
   * Handle moving an element
   * @param ref Unique identifier of element being moved
   * @param param1 Change in (X, Y) coordinates
   */
  handleMove(ref: MoveRef, [movementX, movementY]: [number, number]): void;

  /**
   * Handle dropping an element
   * @param ref Unique identifier of element that was grabbed
   * @param targetNodeId Unique identifier of element that it was dropped into
   */
  handleDrop(ref: GrabRef, targetNodeId: string): void;

  /**
   * Render a grabbed element
   * @param ref Unique identifier of grabbed element
   */
  renderVirtualElement(ref: GrabRef): JSX.Element;

  /**
   * Properties applied to the canvas component
   */
  canvasProps?: Omit<ComponentProps<typeof Canvas>, "zoomRef">;

  /**
   * Properties applied to the container element
   */
  containerProps?: JSX.HTMLAttributes<HTMLDivElement>;
};

/**
 * Search for an applicable drop zone under the cursor.
 * @param clientX
 * @param clientY
 * @returns
 */
function searchForDropZone(clientX: number, clientY: number) {
  // Try to use DOM methods to find the element first
  const els = document.elementsFromPoint(clientX, clientY);
  for (const el of els) {
    if (el.hasAttribute("data-drop-zone")) {
      return el.getAttribute("data-drop-zone")!;
    }
  }

  // If nothing is found, double check the result by scanning
  // through the top element's children, this is necessary as
  // in some events the information returned by elementsFromPoint
  // is not accurate or otherwise not appropriate for what we want.
  const zones = els[0]!.querySelectorAll("data-drop-zone");
  for (const zone of zones) {
    const pos = zone.getBoundingClientRect();
    if (
      clientX > pos.left &&
      clientX < pos.right &&
      clientY > pos.top &&
      clientY < pos.bottom
    ) {
      return zone.getAttribute("data-drop-zone")!;
    }
  }
}

/**
 * Canvas with additional interactivity tools built-in
 */
export function InteractiveCanvas<M, G>(props: Props<M, G>) {
  const [moving, setMoving] = createSignal<M | undefined>();
  const [grabbed, setGrabbed] = createSignal<G | undefined>();
  const [virtualCoords, setVirtualCoords] = createSignal([0, 0]);

  let zoomRef: Accessor<number> | undefined;

  /**
   * Handle items being dropped in canvas
   * @param ev Mouse Event
   */
  function onMouseUp(ev: MouseEvent) {
    if (moving()) {
      setMoving(undefined);
    }

    const grabRef = grabbed();
    if (grabRef) {
      setGrabbed(undefined);

      const nodeId = searchForDropZone(ev.clientX, ev.clientY);
      if (nodeId) {
        props.handleDrop(grabRef, nodeId);
      }
    }
  }

  /**
   * Handle mouse being moved in the canvas area
   * @param ev Mouse Event
   */
  function onMouseMove(ev: MouseEvent) {
    if (grabbed()) {
      setVirtualCoords([ev.clientX, ev.clientY]);
    }
  }

  if (typeof window !== "undefined") {
    // Register all mouse events globally
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    // Remove mouse events when component is unmounted
    onCleanup(() => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    });
  }

  return (
    <CanvasContext.Provider
      value={{
        // Handle incoming instructions from the directives
        setGrabbed(ref, virtualX, virtualY) {
          setGrabbed(ref);
          setVirtualCoords([virtualX, virtualY]);
        },
        setMoving(ref) {
          setMoving(ref);
        },
      }}
    >
      <div
        {...props.containerProps}
        onMouseMove={(e) => {
          // Check if we are moving an element,
          // if so transform mouse movement and apply.
          const movingRef = moving();
          if (movingRef) {
            props.handleMove(movingRef, [
              e.movementX / zoomRef!(),
              e.movementY / zoomRef!(),
            ]);
          }
        }}
        onMouseLeave={() => setMoving(undefined)}
      >
        {props.preCanvas}
        <Canvas {...props.canvasProps} zoomRef={(ref) => (zoomRef = ref)}>
          {props.children}
        </Canvas>
        {props.postCanvas}
      </div>

      <Show when={grabbed()}>
        <Portal>
          <div
            style={{
              position: "fixed",
              left: virtualCoords()[0] + "px",
              top: virtualCoords()[1] + "px",
              transform: "translate(-50%, -50%) rotateZ(-3deg)",
            }}
          >
            {props.renderVirtualElement(grabbed()!)}
          </div>
        </Portal>
      </Show>
    </CanvasContext.Provider>
  );
}
