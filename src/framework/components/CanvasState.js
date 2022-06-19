import React, { useState, useContext, createContext, useCallback } from "react";
import { min } from "lodash";

const CanvasStateContext = createContext({});

export const useCanvasState = () => useContext(CanvasStateContext);

const CanvasState = ({ width, height, ...props }) => {
  const [zoom, setZoom] = useState(1.0);
  const [scroll, setScroll] = useState([width, height]);
  const [offset, setOffset] = useState([-width, -height]);
  const [selected, setSelected] = useState(null);

  const zoomIn = useCallback(() => setZoom(zoom + 0.1), [zoom, setZoom]);
  const zoomOut = useCallback(() => setZoom(zoom - 0.1), [zoom, setZoom]);
  const zoomReset = useCallback(() => setZoom(1), [setZoom]);

  const zoomToRect = (rect) => {
    const contentW = rect.r - rect.l;
    const contentH = rect.b - rect.t;
    const center = [(rect.r + rect.l) / 2, (rect.t + rect.b) / 2];

    const newZoom = min([width / contentW, height / contentH]);
    setZoom(newZoom);
    setOffset([
      center[0] * newZoom - width * 1.5,
      center[1] * newZoom - height * 1.5
    ]);
    setScroll([width, height]);
  };

  return (
    <CanvasStateContext.Provider
      value={{
        zoom,
        setZoom,
        zoomIn,
        zoomOut,
        zoomReset,
        scroll,
        setScroll,
        offset,
        zoomToRect,
        setOffset,
        selected,
        setSelected
      }}
      {...props}
    />
  );
};

export default CanvasState;
