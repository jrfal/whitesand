import React, { useState, useRef } from "react";
import { Circle, Line, Group, Text } from "react-konva";
import { useCanvasPort } from "./Canvas";

export const portSize = 10;

const portProps = {
  width: portSize,
  height: portSize,
  fill: "blue",
  offsetX: 0,
  offsetY: 0
};

export const DragWire = ({ data, ...props }) => {
  const { setDragData } = useCanvasPort();
  const fromPort = useRef(null);
  const toPort = useRef(null);
  const [nothing, setNothing] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const { id } = props;

  const handleDragStart = () => {
    setDragData({ id, type: "port", ...data });
    setIsDragging(true);
  };
  const handleDragEnd = (event) => {
    setIsDragging(false);

    // move it back to the from position
    toPort.current.position(fromPort.current.position());
  };

  return (
    <>
      {isDragging && (
        <Line
          x={fromPort.current ? fromPort.current.position().x : 0}
          y={fromPort.current ? fromPort.current.position().y : 0}
          points={[
            0,
            0,
            toPort.current
              ? toPort.current.position().x - fromPort.current.position().x
              : 0,
            toPort.current
              ? toPort.current.position().y - fromPort.current.position().y
              : 0
          ]}
          stroke="black"
          {...props}
        />
      )}
      <Circle
        width={portSize}
        height={portSize}
        fill="transparent"
        ref={fromPort}
        {...props}
      />
      <Circle
        {...portProps}
        name={`${id}`}
        fill="transparent"
        draggable
        ref={toPort}
        onDragStart={handleDragStart}
        onDragMove={setNothing}
        onDragEnd={handleDragEnd}
        {...props}
      />
    </>
  );
};

const Port = ({ isHighlighted, isDisabled, label, ...props }) => {
  return (
    <Group {...props}>
      <Circle
        {...portProps}
        fill={isDisabled ? "gray" : isHighlighted ? "red" : "blue"}
      />
      <Text
        text={label}
        height={portProps.height}
        x={8}
        y={-0.5 * portProps.height}
      />
    </Group>
  );
};

export default Port;
