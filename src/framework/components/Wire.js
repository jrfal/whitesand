import React from "react";
import { Line } from "react-konva";
import { useCanvasWire } from "./Canvas";

export default ({ ports, isLocked, ...props }) => {
  const {
    points: [[x1, y1], [x2, y2]],
    handleSelect,
    isSelected
  } = useCanvasWire(ports);
  return (
    <Line
      x={x1}
      y={y1}
      points={[0, 0, x2 - x1, y2 - y1]}
      stroke={isSelected ? "red" : "gray"}
      strokeWidth={isLocked ? 2 : 1}
      hitStrokeWidth={15}
      {...props}
      onClick={handleSelect}
      isSelected={isSelected}
    />
  );
};
