import { createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./Canvas.module.css";

export function Canvas() {
  // Keep track of origin and zoom
  const [originX, setOriginX] = createSignal(0);
  const [originY, setOriginY] = createSignal(0);
  const [zoom, setZoom] = createSignal(0);

  // Handle panning of canvas
  const [pan, setPan] = createSignal(false);
  const startPan = (event: MouseEvent | TouchEvent) => {
    if (event.target instanceof SVGSVGElement) {
      event.preventDefault();
      setPan(true);
    }
  };
  const stopPan = () => setPan(false);
  const onPan = (event: MouseEvent | TouchEvent) => {
    if (pan()) {
      event.preventDefault();

      setOriginX(
        (ox) =>
          ox -
          (event instanceof MouseEvent ? event.movementX : 0) / zoomFactor()
      );

      setOriginY(
        (oy) =>
          oy -
          (event instanceof MouseEvent ? event.movementY : 0) / zoomFactor()
      );
    }
  };

  // Determine constants
  const zoomFactor = () => 2 ** zoom();
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  let svgRef: SVGSVGElement | undefined;

  // Keep track of the element's w/h
  function updateSize() {
    setWidth(svgRef!.clientWidth);
    setHeight(svgRef!.clientHeight);
  }

  createEffect(() => {
    if (svgRef) {
      const observer = new ResizeObserver((_entries) => {
        // TODO: probably bad performance if this monitors child elements
        updateSize();
      });

      observer.observe(svgRef!);
      return () => observer.disconnect();
    }
  }, [svgRef]);

  // Determine which portion of the SVG to display
  const viewBox = () =>
    `${originX()} ${originY()} ${width() / zoomFactor()} ${
      height() / zoomFactor()
    }`;

  // Zoom handling
  // TODO: handle CTRL + +/- if possible
  const zoomIn = () => setZoom((v) => v + 0.2);
  const zoomOut = () => setZoom((v) => v - 0.2);

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "=":
        zoomIn();
        break;
      case "-":
        zoomOut();
        break;
    }
  }

  document.addEventListener("keydown", onKeyDown);
  onCleanup(() => document.removeEventListener("keydown", onKeyDown));

  return (
    <svg
      class={styles.canvas}
      ref={svgRef}
      viewBox={viewBox()}
      onMouseDown={startPan}
      onMouseUp={stopPan}
      onMouseMove={onPan}
      onTouchStart={startPan}
      onTouchEnd={stopPan}
      onTouchMove={onPan}
    >
      <foreignObject x={100} y={100} width={100} height={100}>
        {() => (
          <div style={{ width: "100px", height: "100px", background: "gray" }}>
            a
          </div>
        )}
      </foreignObject>
      <foreignObject x={220} y={140} width={100} height={100}>
        {() => (
          <div style={{ width: "100px", height: "100px", background: "gray" }}>
            b
          </div>
        )}
      </foreignObject>
    </svg>
  );
}
