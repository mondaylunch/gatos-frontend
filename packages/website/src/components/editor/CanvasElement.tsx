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
   * Element width
   */
  width: number;

  /**
   * Element height
   */
  height: number;

  /**
   * Child element
   *
   * * Must only have one descendant
   */
  children: JSX.Element;
};

export function CanvasElement(props: Props) {
  const [local, remote] = splitProps(props, ["x", "y", "width", "height"]);

  return (
    <foreignObject
      {...remote}
      x={local.x}
      y={local.y}
      width={local.width}
      height={local.height}
      style={{ "--width": local.width + "px", "--height": local.height + "px" }}
    />
  );
}
