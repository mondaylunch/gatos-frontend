import {
  Accessor,
  ComponentProps,
  createContext,
  createEffect,
  createSignal,
  JSX,
  on,
  onCleanup,
  Show,
  Signal,
  useContext,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Canvas } from "./Canvas";
import { CanvasContext } from "./context";
import isEqual from "lodash.isequal";

type Props<MoveRef, GrabRef, SelectRef> = {
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
   * Handle selecting an element on the canvas (single-click / single-tap)
   * @param ref Unique identified of element being selected
   */
  handleSelect(ref?: SelectRef): void;

  /**
   * Handle moving an element
   * @param ref Unique identifier of element being moved
   * @param param1 Change in (X, Y) coordinates
   */
  handleMove(ref: MoveRef, [movementX, movementY]: [number, number]): void;

  /**
   * Handle dropping an element
   * @param param1 Position of dropped element
   * @param ref Unique identifier of element that was grabbed
   * @param targetNodeId Unique identifier of element that it was dropped into
   */
  handleDrop(
    [posX, posY]: [number, number],
    ref: GrabRef,
    targetNodeId?: string
  ): void;

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
 * Provide the currently grabbed element information
 */
export const GrabbedSignalContext = createContext<Accessor<any>>();

/**
 * Provide the currently selected element information
 */
export const SelectedElementContext = createContext<Signal<string>>();

/**
 * Signal children elements whether this element is currently selected
 */
export const SelectionSignalContext = createContext<Accessor<boolean>>();

/**
 * Create an accessor for whether the given element ID is selected
 * @param id Element reference
 * @returns Accessor
 */
export function useSelected<SelectRef>(id: SelectRef) {
  return () => isEqual(useContext(SelectedElementContext)![0](), id);
}

/**
 * Retrieve whether the current element is selected
 */
export function useSelfSelected() {
  return useContext(SelectionSignalContext);
}

/**
 * Canvas with additional interactivity tools built-in
 */
export function InteractiveCanvas<M, G, S>(props: Props<M, G, S>) {
  const [moving, setMoving] = createSignal<M | undefined>();
  const [grabbed, setGrabbed] = createSignal<G | undefined>();
  const selected = createSignal<S | undefined>();
  const [virtualCoords, setVirtualCoords] = createSignal([0, 0]);

  let zoomRef: Accessor<number> | undefined;
  let transformRef:
    | ((coords: [number, number]) => [number, number])
    | undefined;

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
      console.info(
        ev.clientX,
        ev.clientY,
        transformRef!([ev.clientX, ev.clientY])
      );
      props.handleDrop(
        transformRef!([ev.clientX, ev.clientY]),
        grabRef,
        nodeId
      );
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

  /**
   * Pass-through the selected node information
   */
  createEffect(on(() => selected[0](), props.handleSelect));

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
      <GrabbedSignalContext.Provider value={grabbed}>
        <SelectedElementContext.Provider value={selected as Signal<any>}>
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
            <Canvas
              {...props.canvasProps}
              zoomRef={(ref) => (zoomRef = ref)}
              transformRef={(ref) => (transformRef = ref)}
              onMouseDown={() => selected[1](undefined)}
            >
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
        </SelectedElementContext.Provider>
      </GrabbedSignalContext.Provider>
    </CanvasContext.Provider>
  );
}
