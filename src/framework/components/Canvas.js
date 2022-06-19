import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";
import reducer, { initial } from "../reducers/canvas";
import {
  setHoverRect,
  clearHoverRect,
  setDragData,
  clearDragData,
  setSelectRect
} from "../reducers/canvas/actions";
import {
  getNode,
  getIntersectingNodes,
  getIntersectingWires
} from "../reducers/canvas/utils";
import { getPortPosition } from "./Node";
import { Stage, Layer } from "react-konva";
import { getRect } from "./utils/geo";
import Node, {
  nodeWidth,
  nodeHeight,
  defaultInPorts,
  defaultOutPorts
} from "./Node";
import Wire from "./Wire";
import { doRectsIntersect } from "./utils/geo";
import SelectionRectangle from "./SelectionRectangle";
import { get, xor, chain } from "lodash";
import { useCanvasState } from "./CanvasState";
import { canvasFromScreen } from "./utils/screen";

const CanvasContext = createContext([initial]);

const isNodeSelected = (selected, nodeId) => {
  if (selected && selected.nodes) {
    return selected.nodes.includes(nodeId);
  }
  return false;
};

const isWireSelected = (selected, wireId) => {
  if (selected && selected.wires) {
    return selected.wires.includes(wireId);
  }
  return false;
};

export const useCanvasNode = (nodeId, props) => {
  const { state, onMoveNode, setSelected, selected } = useContext(
    CanvasContext
  );

  const selectNode = useCallback(
    (nodeId) => {
      setSelected({
        nodes: [nodeId],
        wires: []
      });
    },
    [setSelected]
  );

  const toggleSelectNode = useCallback(
    (nodeId) => {
      setSelected({
        ...selected,
        nodes: xor(selected.nodes, [nodeId])
      });
    },
    [selected, setSelected]
  );

  const { hoverRect } = state || {};

  return {
    handleMove: (id, x, y) => {
      onMoveNode(id, x, y, get(selected, "nodes", []));
    },
    handleSelect: (event) => {
      if (event.evt.shiftKey) {
        toggleSelectNode(nodeId);
      } else {
        selectNode(nodeId);
      }
    },
    isSelected: (id) => isNodeSelected(selected, id),
    isHighlighted:
      hoverRect &&
      doRectsIntersect(
        {
          l: props.x,
          t: props.y,
          r: props.x + nodeWidth,
          b: props.y + nodeHeight
        },
        hoverRect
      ),
    hoverRect
  };
};

export const useCanvasWire = (ports) => {
  const { state, selected, setSelected } = useContext(CanvasContext);
  const myGetNode = getNode(state);

  const selectWire = useCallback(
    (wireId) => {
      setSelected({
        nodes: [],
        wires: [wireId]
      });
    },
    [setSelected]
  );

  const toggleSelectWire = useCallback(
    (wireId) => {
      setSelected({
        ...selected,
        wires: xor(selected.wires, [wireId])
      });
    },
    [selected, setSelected]
  );

  return {
    points: [
      getPortPosition(myGetNode(ports[0][0]))(ports[0][1]),
      getPortPosition(myGetNode(ports[1][0]))(ports[1][1])
    ],
    handleSelect: (event) => {
      if (event.evt.shiftKey) {
        toggleSelectWire(ports.join("|"));
      } else {
        selectWire(ports.join("|"));
      }
    },
    isSelected: isWireSelected(selected, ports.join("|"))
  };
};

export const useCanvasPort = () => {
  const { dispatch } = useContext(CanvasContext);

  return {
    setDragData: (data) => {
      dispatch(setDragData(data));
    }
  };
};

const getNodesFromChildren = (children) =>
  chain(React.Children.toArray(children))
    .filter({ type: Node })
    .map(({ props: { id, x, y, outPorts, disabledPorts } }) => ({
      id,
      x,
      y,
      outPorts,
      disabledPorts
    }))
    .value();

const getWiresFromChildren = (children) =>
  chain(React.Children.toArray(children))
    .filter({ type: Wire })
    .map(({ props: { ports } }) => ({
      a: ports[0],
      b: ports[1]
    }))
    .value();

const Canvas = ({
  children,
  onLink,
  width,
  height,
  onMoveNode,
  onDelete,
  ...props
}) => {
  const [rawState, dispatch] = useReducer(reducer);
  const [zoomKey, setZoomKey] = useState(false);
  const [selectToggleMode, setSelectToggleMode] = useState(false);
  const [rightDrag, setRightDrag] = useState(null);
  const {
    zoom,
    zoomIn,
    zoomOut,
    zoomToRect,
    offset,
    scroll,
    setOffset,
    setScroll,
    selected,
    setSelected
  } = useCanvasState();
  const stage = useRef(null);
  const viewport = useRef(null);

  const nodes = getNodesFromChildren(children);
  const wires = getWiresFromChildren(children);
  const state = {
    ...rawState,
    nodes
  };

  const toggleSelectNodesAndWires = useCallback(
    (nodeIds, wireIds) => {
      setSelected({
        nodes: xor(selected.nodes, nodeIds),
        wires: xor(selected.wires, wireIds)
      });
    },
    [selected, setSelected]
  );

  const selectNodesAndWires = useCallback(
    (nodeIds, wireIds) => {
      setSelected({
        nodes: nodeIds,
        wires: wireIds
      });
    },
    [setSelected]
  );

  // do we need to update the scroll position?
  useEffect(() => {
    if (viewport.current) {
      let vp = viewport.current;
      if (scroll[0] !== vp.scrollLeft || scroll[1] !== vp.scrollTop) {
        vp.scrollLeft = scroll[0];
        vp.scrollTop = scroll[1];
      }
    }
  });

  // listen to keys
  useEffect(() => {
    const upHandler = (event) => {
      if (event.key === "Backspace" && event.target.tagName === "BODY") {
        setSelected(null);
        onDelete(get(selected, "nodes", []), get(selected, "wires", []));
      }
      if (event.key === "=" && event.target.tagName === "BODY") {
        zoomIn();
      }
      if (event.key === "-" && event.target.tagName === "BODY") {
        zoomOut();
      }
      if (event.key === "z" && event.target.tagName === "BODY") {
        setZoomKey(false);
      }
    };
    const downHandler = (event) => {
      if (event.key === "z" && event.target.tagName === "BODY") {
        setZoomKey(true);
      }
    };
    window.addEventListener("keyup", upHandler);
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keyup", upHandler);
      window.removeEventListener("keydown", downHandler);
    };
  }, [zoomIn, onDelete, zoomOut, zoomKey, setZoomKey, selected, setSelected]);

  const { selectRect } = state;

  const handleScroll = ({ target }) => {
    if (
      target.scrollLeft > width * 1.5 ||
      target.scrollLeft < width * 0.5 ||
      target.scrollTop > height * 1.5 ||
      target.scrollTop < height * 0.5
    ) {
      setOffset([
        offset[0] - width + target.scrollLeft,
        offset[1] - height + target.scrollTop
      ]);
      setScroll([width, height]);
    } else {
      setScroll([target.scrollLeft, target.scrollTop]);
    }
  };

  const handleMouseDown = ({ target, evt: { x, y, shiftKey, button } }) => {
    if (button === 2) {
      setRightDrag([
        x,
        y,
        viewport.current.scrollLeft,
        viewport.current.scrollTop
      ]);
      return;
    }
    if (shiftKey) {
      setSelectToggleMode(true);
    } else {
      setSelectToggleMode(false);
    }
    if (target === stage.current) {
      const newX = canvasFromScreen(
        viewport.current.scrollLeft,
        offset[0],
        zoom
      )(x);
      const newY = canvasFromScreen(
        viewport.current.scrollTop,
        offset[1],
        zoom
      )(y);
      dispatch(
        setSelectRect({
          x: newX,
          y: newY,
          l: newX,
          t: newY,
          r: newX,
          b: newY
        })
      );
    }
  };

  const handleMouseMove = ({ target, evt: { x, y, buttons } }) => {
    if (selectRect) {
      if (buttons % 2 > 0) {
        const newX = canvasFromScreen(
          viewport.current.scrollLeft,
          offset[0],
          zoom
        )(x);
        const newY = canvasFromScreen(
          viewport.current.scrollTop,
          offset[1],
          zoom
        )(y);
        dispatch(
          setSelectRect({
            x: selectRect.x,
            y: selectRect.y,
            l: selectRect.x < newX ? selectRect.x : newX,
            t: selectRect.y < newY ? selectRect.y : newY,
            r: selectRect.x > newX ? selectRect.x : newX,
            b: selectRect.y > newY ? selectRect.y : newY
          })
        );
      } else {
        dispatch(setSelectRect(null));
      }
    }
    if (rightDrag) {
      if (buttons % 4 > 1) {
        viewport.current.scrollLeft = rightDrag[2] - x + rightDrag[0];
        viewport.current.scrollTop = rightDrag[3] - y + rightDrag[1];
      } else {
        setRightDrag(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (selectRect) {
      if (zoomKey) {
        zoomToRect(selectRect);
      } else {
        if (selectToggleMode) {
          toggleSelectNodesAndWires(
            getIntersectingNodes(nodes, selectRect).map((node) => node.id),
            getIntersectingWires(wires, nodes, selectRect).map(
              (wire) => `${wire.a}|${wire.b}`
            )
          );
        } else {
          selectNodesAndWires(
            getIntersectingNodes(nodes, selectRect).map((node) => node.id),
            getIntersectingWires(wires, nodes, selectRect).map(
              (wire) => `${wire.a}|${wire.b}`
            )
          );
        }
      }
    }
    dispatch(setSelectRect(null));
    setRightDrag(null);
  };

  const handleDrag = (event) => {
    dispatch(setHoverRect(getRect(event.target)));
  };

  const maybeLink = (portY, aNode, aPort, bNode, bPort) => {
    const { hoverRect } = state;
    if (hoverRect.t <= portY && hoverRect.b >= portY) {
      onLink(aNode, aPort, bNode, bPort);
      return true;
    }
    return false;
  };

  const getPortY = (i, count, y) => ((i + 1) * nodeHeight) / (count + 1) + y;

  const handleDragEnd = (event) => {
    const { hoverRect, dragData = {} } = state;
    const [nodeId, port] = event.target.name().split(/\|/);
    if (hoverRect && dragData.type === "port") {
      getIntersectingNodes(nodes, hoverRect).map(
        ({
          id,
          inPorts = defaultInPorts,
          outPorts = defaultOutPorts,
          x,
          y,
          disabledPorts
        }) => {
          if (hoverRect.l <= x && dragData.direction !== "in") {
            for (let i = 0; i < inPorts.length; i++) {
              if (
                maybeLink(
                  getPortY(i, inPorts.length, y),
                  nodeId,
                  port,
                  id,
                  inPorts[i]
                )
              ) {
                return true;
              }
            }
          } else if (
            hoverRect.r >= x + nodeWidth &&
            dragData.direction !== "out"
          ) {
            for (let i = 0; i < outPorts.length; i++) {
              if (!disabledPorts || !disabledPorts.includes(outPorts[i])) {
                if (
                  maybeLink(
                    getPortY(i, outPorts.length, y),
                    id,
                    outPorts[i],
                    nodeId,
                    port
                  )
                ) {
                  return true;
                }
              }
            }
          }
          if (
            !disabledPorts ||
            !disabledPorts.includes(dragData.direction === "out" ? "in" : "out")
          ) {
            if (dragData.direction === "out") {
              onLink(nodeId, port, id, "in");
            } else {
              onLink(id, "out", nodeId, port);
            }
          }
          return true;
        }
      );
    }
    dispatch(clearHoverRect);
    dispatch(clearDragData);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: "auto"
      }}
      onContextMenu={(event) => event.preventDefault()}
      ref={viewport}
      onScroll={handleScroll}
    >
      <Stage
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={width * 3}
        height={height * 3}
        ref={stage}
        offsetX={offset[0]}
        offsetY={offset[1]}
      >
        <CanvasContext.Provider
          value={{ state, dispatch, onMoveNode, selected, setSelected }}
          {...props}
        >
          <Layer
            scale={{ x: zoom, y: zoom }}
            onDragMove={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {children}
            {selectRect && (
              <SelectionRectangle
                x={selectRect.l}
                y={selectRect.t}
                width={selectRect.r - selectRect.l}
                height={selectRect.b - selectRect.t}
                isZooming={zoomKey}
              />
            )}
          </Layer>
        </CanvasContext.Provider>
      </Stage>
    </div>
  );
};

export default Canvas;
