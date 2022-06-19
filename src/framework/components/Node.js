import React, { useState, useRef } from "react";
import { Rect, Group, Text } from "react-konva";
import Port, { DragWire } from "./Port";
import { indexOf } from "lodash";
import { useCanvasNode } from "./Canvas";

export const nodeWidth = 60;
export const nodeHeight = 50;
export const nodePadding = 5;

export const defaultInPorts = ["in"];
export const defaultOutPorts = ["out"];

const getRelativePortPosition = (isOut, index, total) => {
  if (!isOut) {
    return [0, ((index + 1) * nodeHeight) / (total + 1)];
  }

  return [nodeWidth, ((index + 1) * nodeHeight) / (total + 1)];
};

export const getPortPosition = (node = {}) => (port) => {
  const { x, y, outPorts = defaultOutPorts, inPorts = defaultInPorts } = node;

  let index = indexOf(inPorts, port);

  const relative =
    index >= 0
      ? getRelativePortPosition(false, index, inPorts.length)
      : getRelativePortPosition(true, indexOf(outPorts, port), outPorts.length);

  return [relative[0] + x, relative[1] + y];
};

export const getPortPositions = (node) => {
  const { x, y, outPorts = defaultOutPorts, inPorts = defaultInPorts } = node;
  let ports = {};

  outPorts.forEach((port, index) => {
    ports[port] = getRelativePortPosition(true, index, outPorts.length);
  });
  inPorts.forEach((port, index) => {
    ports[port] = getRelativePortPosition(false, index, inPorts.length);
  });

  return ports;
};

const doRectsIntersect = (a, b) =>
  a.l <= b.r && a.t <= b.b && b.l <= a.r && b.t <= a.b;

export default ({
  id,
  onMove,
  color = "white",
  name = "Node Name",
  inPorts = defaultInPorts,
  outPorts = defaultOutPorts,
  disabledPorts = [],
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const box = useRef(null);
  const {
    handleMove,
    isHighlighted,
    hoverRect,
    handleSelect,
    isSelected
  } = useCanvasNode(id, props);

  const handleDragMove = (event) => {
    const { x, y } = event.target.attrs;
    handleMove(id, x, y);
  };

  const handleDragStart = (event) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
  };

  return (
    <>
      <Group
        draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        width={nodeWidth}
        height={nodeHeight}
        onClick={handleSelect}
        {...props}
      >
        <Rect
          width={nodeWidth}
          height={nodeHeight}
          fill={isHighlighted && !isDragging ? "blue" : color}
          stroke={isSelected(id) ? "purple" : "gray"}
          cornerRadius={4}
          ref={box}
        />
        <Text
          x={nodePadding}
          width={nodeWidth - nodePadding * 2}
          height={nodeHeight}
          verticalAlign="middle"
          align="center"
          text={name}
          fill={isHighlighted && !isDragging ? "white" : "black"}
        />
        {inPorts.map((port, index) => {
          const portPos = getRelativePortPosition(false, index, inPorts.length);
          return (
            <Port
              x={portPos[0]}
              y={portPos[1]}
              isHighlighted={
                isHighlighted &&
                !isDragging &&
                hoverRect &&
                doRectsIntersect(hoverRect, {
                  l: props.x + portPos[0],
                  t: props.y + portPos[1],
                  r: props.x + portPos[0],
                  b: props.y + portPos[1]
                }) &&
                !disabledPorts.includes(port)
              }
              isDisabled={disabledPorts.includes(port)}
            />
          );
        })}
        {outPorts.map((port, index) => {
          const portPos = getRelativePortPosition(true, index, outPorts.length);
          return (
            <Port
              label={port}
              x={portPos[0]}
              y={portPos[1]}
              isHighlighted={
                isHighlighted &&
                !isDragging &&
                hoverRect &&
                doRectsIntersect(hoverRect, {
                  l: props.x + portPos[0],
                  t: props.y + portPos[1],
                  r: props.x + portPos[0],
                  b: props.y + portPos[1]
                }) &&
                !disabledPorts.includes(port)
              }
              isDisabled={disabledPorts.includes(port)}
            />
          );
        })}
      </Group>
      {!isDragging && (
        <>
          {inPorts.map((port, index) => {
            if (disabledPorts.includes(port)) {
              return false;
            }
            const portPos = getRelativePortPosition(
              false,
              index,
              inPorts.length
            );
            return (
              <DragWire
                id={`${id}|${port}|in`}
                {...props}
                y={props.y + portPos[1]}
                data={{ direction: "in" }}
              />
            );
          })}
          {outPorts.map((port, index) => {
            if (disabledPorts.includes(port)) {
              return false;
            }
            const portPos = getRelativePortPosition(
              true,
              index,
              outPorts.length
            );
            return (
              <DragWire
                id={`${id}|${port}|out`}
                {...props}
                x={props.x + portPos[0]}
                y={props.y + portPos[1]}
                data={{ direction: "out" }}
              />
            );
          })}
        </>
      )}
    </>
  );
};
