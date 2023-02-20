import { JSX, splitProps } from "solid-js";

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
};

/**
 * Wrapper element for rendering into the canvas
 */
export function CanvasElement(props: Props) {
  const [local, remote] = splitProps(props, ["x", "y"]);
  return (
    <foreignObject
      {...remote}
      x={local.x}
      y={local.y}
      style={{
        width: "1px",
        height: "1px",
        overflow: "visible",
      }}
    />
  );
}
