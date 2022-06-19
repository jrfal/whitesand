import { FiZoomIn, FiZoomOut, FiGrid } from "react-icons/fi";
import { useCanvasState } from "../framework/components/CanvasState";

const ZoomControls = ({ rect }) => {
  const { zoom, zoomToRect, zoomIn, zoomOut, zoomReset } = useCanvasState();

  return (
    <>
      <button onClick={zoomIn}>
        <FiZoomIn />
      </button>
      <button onClick={zoomReset}>{Math.round(zoom * 100)}</button>
      <button
        onClick={() => {
          zoomToRect(rect);
        }}
      >
        <FiGrid />
      </button>
      <button onClick={zoomOut}>
        <FiZoomOut />
      </button>
    </>
  );
};

export default ZoomControls;
