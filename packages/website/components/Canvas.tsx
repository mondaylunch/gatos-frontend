import { createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./Canvas.module.css";

const MIN_ZOOM = -2;
const MAX_ZOOM = 2;

export function Canvas() {
  // Keep track of origin and zoom
  const [originX, setOriginX] = createSignal(0);
  const [originY, setOriginY] = createSignal(0);
  const [zoom, setZoom] = createSignal(0);

  // Keep track of mouse position for calculating zoom
  const [mouseX, setMouseX] = createSignal(0);
  const [mouseY, setMouseY] = createSignal(0);

  // Handle panning of canvas
  const [pan, setPan] = createSignal(false);

  // Create event handlers for mouse panning
  const onMouseDown = (event: MouseEvent) => {
    if (event.target instanceof SVGSVGElement) {
      event.preventDefault();
      setPan(true);
    }
  };

  const onMouseUp = () => setPan(false);

  const onMouseMove = (event: MouseEvent) => {
    setMouseX(event.offsetX);
    setMouseY(event.offsetY);

    if (pan()) {
      event.preventDefault();
      setOriginX((ox) => ox - event.movementX / zoomFactor());
      setOriginY((oy) => oy - event.movementY / zoomFactor());
    }
  };

  // Determine constants
  const computeZoom = (v: number) => 2 ** v;
  const zoomFactor = () => computeZoom(zoom());
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  let svgRef: SVGSVGElement | undefined;

  // Keep track of the canvas size
  createEffect(() => {
    if (svgRef) {
      const observer = new ResizeObserver(() => {
        setWidth(svgRef!.clientWidth);
        setHeight(svgRef!.clientHeight);
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
  function scale(factor: number, origin: [number, number]) {
    setZoom((v) => v + factor);

    const zoomDelta = computeZoom(factor);
    const currentZoom = zoomFactor();
    const targetZoom = currentZoom * zoomDelta;

    const [originX, originY] = origin;
    const [dx, dy] = [
      -originX / targetZoom + originX / currentZoom,
      -originY / targetZoom + originY / currentZoom,
    ];

    setOriginX((x) => x + dx);
    setOriginY((y) => y + dy);
  }

  function clampScale(factor: number, origin: [number, number]) {
    const currentValue = zoom();
    const target = Math.max(
      Math.min(currentValue + factor, MAX_ZOOM),
      MIN_ZOOM
    );

    scale(target - currentValue, origin);
  }

  // Create event listener for handling mouse zoom
  function onWheel(event: WheelEvent) {
    clampScale(-event.deltaY * 0.001, [mouseX(), mouseY()]);
  }

  // Create event handler for overriding browser zoom keys
  function onKeyDown(event: KeyboardEvent) {
    const origin = () => [width() / 2, height() / 2] as [number, number];

    if (event.ctrlKey) {
      switch (event.key) {
        case "=":
          event.preventDefault();
          clampScale(0.05, origin());
          break;
        case "-":
          event.preventDefault();
          clampScale(-0.05, origin());
          break;
      }
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  }

  // Handle touch events for zoom and pan
  const [trackedTouches, setTrackedTouches] = createSignal<
    undefined | TouchList
  >();

  function onTouchStart(event: TouchEvent) {
    if (event.touches.length) setTrackedTouches(event.touches);
  }

  function onTouchEnd(event: TouchEvent) {
    if (!event.touches.length) setTrackedTouches(undefined);
  }

  function onTouchMove(event: TouchEvent) {
    const list = trackedTouches();
    if (!list) return;

    const touchDelta = [...list]
      .map(
        (touch) =>
          [
            touch,
            [...event.touches].find(
              (entry) => entry.identifier === touch.identifier
            ),
          ] as [Touch, Touch]
      )
      .map(
        ([start, end]) =>
          [
            end.clientX - start.clientX,
            end.clientY - start.clientY,
            [end.clientX, end.clientY],
            [start.clientX, start.clientY],
          ] as [number, number, [number, number], [number, number]]
      );

    if (touchDelta.length === 1) {
      // Pan
      const [[dx, dy]] = touchDelta;
      setOriginX((x) => x - dx / zoomFactor());
      setOriginY((y) => y - dy / zoomFactor());
    } else if (touchDelta.length === 2) {
      // Pan and Zoom
      const [
        [dx1, dy1, [finalX1, finalY1], [startX1, startY1]],
        [dx2, dy2, [finalX2, finalY2], [startX2, startY2]],
      ] = touchDelta;

      // Determine if we are panning or zooming on different x and y axis
      // equal signs => pan
      // diff signs => zoom
      let xScale = 0,
        yScale = 0;

      if ((dx1 < 0 && dx2 >= 0) || (dx2 < 0 && dx1 >= 0)) {
        xScale += dx2 - dx1;
      } else {
        setOriginX((x) => x - dx1 / zoomFactor());
      }

      if ((dy1 < 0 && dy2 >= 0) || (dy2 < 0 && dy1 >= 0)) {
        yScale += dy2 - dy1;
      } else {
        setOriginY((x) => x - dx1 / zoomFactor());
      }

      // Determine scale factor and whether we are zooming
      let scale = Math.sqrt(xScale ** 2 + yScale ** 2);
      if (scale) {
        // Determine direction of zoom
        let startMagntiude = Math.sqrt(
          (startX2 - startX1) ** 2 + (startY2 - startY1) ** 2
        );

        let finalMagntiude = Math.sqrt(
          (finalX2 - finalX1) ** 2 + (finalY2 - finalY1) ** 2
        );

        const direction = finalMagntiude - startMagntiude > 0 ? 1 : -1;

        // Find the center point of the zoom operation
        const origin = [
          startX1 + (startX2 - startX1) / 2,
          startY1 + (startY2 - startY1) / 2,
        ] as [number, number];

        // And zoom
        clampScale(scale * direction * 0.01, origin);
      }
    }

    setTrackedTouches(event.touches);
  }

  return (
    <svg
      class={styles.canvas}
      ref={svgRef}
      viewBox={viewBox()}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      onWheel={onWheel}
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
