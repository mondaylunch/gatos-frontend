import { createEffect, JSX, on, splitProps, useContext } from "solid-js";
import { ElementSizeContext, ZoomFactorContext } from "./Canvas";
import {
  SelectedElementContext,
  SelectionSignalContext,
} from "./InteractiveCanvas";

type Props = Omit<
  JSX.ForeignObjectSVGAttributes<SVGForeignObjectElement>,
  "children"
> & {
  /**
   * Element X position
   */
  x: number;

  /**
   * Element Y position
   */
  y: number;

  /**
   * Child elements
   */
  children: JSX.Element;

  /**
   * Static unique ID of this canvas element
   * Specify this if you want its width / height cached and accessible
   */
  id?: string;
};

/**
 * Wrapper element for rendering into the canvas
 */
export function CanvasElement(props: Props) {
  const [local, remote] = splitProps(props, ["x", "y", "id"]);

  // Declare variable as our reference
  let ref: SVGForeignObjectElement | undefined;

  // If an id has been specified, start monitoring child element
  if (local.id) {
    const [_, setSize] = useContext(ElementSizeContext)!;
    const zoomFactor = useContext(ZoomFactorContext)!;

    createEffect(
      on(
        () => ref,
        (ref) => {
          if (ref) {
            // Pull out first child
            const firstChild = ref.childNodes[0]?.childNodes[0];

            // Calculate and commit size
            if (firstChild) {
              function commit() {
                const rect = (
                  firstChild as HTMLElement
                ).getBoundingClientRect();

                const width = rect.width / zoomFactor();
                const height = rect.height / zoomFactor();

                if (width && height) {
                  setSize(local.id!, { width, height });
                }
              }

              commit();

              const observer = new ResizeObserver(commit);
              observer.observe(firstChild as HTMLElement);
              return () => observer.disconnect();
            }
          }
        }
      )
    );
  }

  // Pull in selection context
  const [selection, setSelected] = useContext(SelectedElementContext)!;
  const isSelected = () => (props.id ? selection() === props.id : false);

  return (
    <SelectionSignalContext.Provider value={isSelected}>
      <foreignObject
        {...remote}
        ref={ref}
        x={local.x}
        y={local.y}
        style={{
          width: "1px",
          height: "1px",
          overflow: "visible",
        }}
        onClick={() => local.id && setSelected(local.id)}
      />
    </SelectionSignalContext.Provider>
  );
}
