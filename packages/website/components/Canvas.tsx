import { createEffect, createSignal } from "solid-js";

export function Canvas() {
  // Keep track of origin and zoom
  const [originX, setOriginX] = createSignal(0);
  const [originY, setOriginY] = createSignal(0);
  const [zoom, setZoom] = createSignal(0);

  // Handle panning of canvas
  const [pan, setPan] = createSignal(false);
  const startPan = () => setPan(true);
  const stopPan = () => setPan(false);
  const onPan = (event: MouseEvent | TouchEvent) => {
    if (pan()) {
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

  return (
    <>
      <svg
        ref={svgRef}
        width="100%"
        height="400px"
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
            <div
              style={{ width: "100px", height: "100px", background: "gray" }}
            >
              hello i am a box
            </div>
          )}
        </foreignObject>
        <foreignObject x={220} y={140} width={100} height={100}>
          {() => (
            <div
              style={{ width: "100px", height: "100px", background: "purple" }}
            >
              get real
            </div>
          )}
        </foreignObject>
      </svg>
      <div>
        <div>zoom: {zoom()}</div>
        <button onClick={() => setZoom((v) => v + 0.2)}>zoom in</button>
        <button onClick={() => setZoom((v) => v - 0.2)}>zoom out</button>
      </div>
    </>
  );
}
