import { Rect } from "react-konva";

const SelectionRectangle = ({ isZooming, ...props }) => (
  <Rect
    fill={isZooming ? "rgba(10,10,10,0.1)" : "rgba(0,0,255,0.5)"}
    stroke={isZooming ? "#555" : "transparent"}
    {...props}
  />
);

export default SelectionRectangle;
