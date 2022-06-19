import React, { useCallback } from "react";
import Node, { nodeWidth, nodeHeight } from "../framework/components/Node";
import Wire from "../framework/components/Wire";
import { getBounds } from "../reducers/model/utils";
import {
  moveNode,
  linkNodes,
  addNode,
  deleteThings
} from "../reducers/model/actions";
import InfoPanel from "./InfoPanel";
import { union } from "lodash";
import * as Dialog from "@radix-ui/react-dialog";
import { styled } from "@stitches/react";
// import SimplePreview from "./SimplePreview";
import ReactPreview from "./ReactPreview";
import { canvasFromScreen } from "../framework/components/utils/screen";
import Canvas from "../framework/components/Canvas";
import { useCanvasState } from "../framework/components/CanvasState";
import ZoomControls from "./ZoomControls";

const StyledContent = styled(Dialog.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25
});

const padRect = (rect, padding) => ({
  l: rect.l - padding,
  r: rect.r + padding,
  t: rect.t - padding,
  b: rect.b + padding
});

export default ({ state, dispatch, width, height }) => {
  const { zoom, scroll, offset } = useCanvasState();

  const handleDelete = useCallback(
    (nodes = [], wires = []) => {
      dispatch(deleteThings(nodes, wires));
    },
    [dispatch]
  );

  const handleMove = (...args) => {
    dispatch(moveNode(...args));
  };

  let disabledPorts = {};
  state.wires.forEach((wire) => {
    disabledPorts[wire.a[0]] = union(disabledPorts[wire.a[0]] || [], [
      wire.a[1]
    ]);
  });

  const handleLink = (aNode, aPort, bNode, bPort) =>
    dispatch(linkNodes(aNode, aPort, bNode, bPort));

  const bounds = getBounds(state);

  return (
    <div>
      <Canvas
        width={width}
        height={height}
        onLink={handleLink}
        onMoveNode={handleMove}
        onDelete={handleDelete}
      >
        {state.wires.map(({ a, b, locked }) => (
          <Wire ports={[a, b]} key={`${a}|${b}`} isLocked={!!locked} />
        ))}
        {state.nodes.map(({ id, type, ...props }) => (
          <Node
            key={id}
            id={id}
            disabledPorts={disabledPorts[id]}
            outPorts={
              type === "upAndDown"
                ? ["up", "down"]
                : type === "multiButtons"
                ? props.buttons
                : undefined
            }
            {...props}
          />
        ))}
      </Canvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          padding: 20
        }}
      >
        <button
          onClick={() =>
            dispatch(
              addNode(
                canvasFromScreen(
                  scroll[0],
                  offset[0],
                  zoom
                )(width / 2 - nodeWidth / 2),
                canvasFromScreen(
                  scroll[1],
                  offset[1],
                  zoom
                )(height / 2 - nodeHeight / 2),
                "New Node"
              )
            )
          }
        >
          New Node
        </button>
        <Dialog.Root>
          <Dialog.Trigger>Preview</Dialog.Trigger>
          <StyledContent>
            <ReactPreview state={state} />
          </StyledContent>
        </Dialog.Root>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          padding: 20
        }}
      >
        <ZoomControls rect={padRect(bounds, 20)} />
      </div>
      <InfoPanel state={state} dispatch={dispatch} />
    </div>
  );
};
