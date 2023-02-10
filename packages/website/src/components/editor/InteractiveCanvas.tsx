import { Accessor, createSignal, JSX, onCleanup } from "solid-js";
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
   * Properties applies to the container element
   */
  containerProps: JSX.HTMLAttributes<HTMLDivElement>;
};

function searchForDropZone(clientX: number, clientY: number) {
  const els = document.elementsFromPoint(clientX, clientY);
  for (const el of els) {
    if (el.hasAttribute("data-drop-zone")) {
      return el.getAttribute("data-drop-zone")!;
    }
  }

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

export function InteractiveCanvas<M, G>(props: Props<M, G>) {
  const [moving, setMoving] = createSignal<M | undefined>();
  const [grabbed, setGrabbed] = createSignal<G | undefined>();
  const [virtualCoords, setVirtualCoords] = createSignal([0, 0]);

  let zoomRef: Accessor<number> | undefined;

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

  document.addEventListener("mouseup", onMouseUp);
  onCleanup(() => document.removeEventListener("mouseup", onMouseUp));

  return (
    <CanvasContext.Provider
      value={{
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
          const movingRef = moving();
          if (movingRef) {
            props.handleMove(movingRef, [
              e.movementX / zoomRef!(),
              e.movementY / zoomRef!(),
            ]);
          }
        }}
      >
        {props.preCanvas}
        <Canvas zoomRef={(ref) => (zoomRef = ref)}>{props.children}</Canvas>
        {props.postCanvas}
      </div>
    </CanvasContext.Provider>
  );
}
