import { JSX } from "solid-js";
import styles from "./Canvas.module.css";

interface Props {
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
}

export function CanvasElement(props: Props) {
  return (
    <foreignObject
      class={styles.element}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      style={{ "--width": props.width + "px", "--height": props.height + "px" }}
    >
      {props.children}
    </foreignObject>
  );
}
