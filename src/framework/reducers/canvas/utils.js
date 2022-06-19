import { find, get } from "lodash";
import { doRectsIntersect } from "../../components/utils/geo";
import { nodeWidth, nodeHeight, getPortPosition } from "../../components/Node";

export const getNode = (state) => (nodeId) =>
  find(get(state, "nodes", []), ({ id } = {}) => id === nodeId);

export const getIntersectingNodes = (nodes, rect) =>
  nodes.filter(({ x, y } = {}) =>
    doRectsIntersect(
      {
        l: x,
        t: y,
        r: x + nodeWidth,
        b: y + nodeHeight
      },
      rect
    )
  );

const isPointWithin = (x, y, { l, t, r, b }) => {
  if (x >= l && x <= r && y >= t && y <= b) {
    return true;
  }
};

const isInRange = (number, low, high) => {
  if (number >= low && number <= high) {
    return true;
  }
  if (number <= low && number >= high) {
    return true;
  }
  return false;
};

const getY = (x, slope, intercept) => x * slope + intercept;
const getX = (y, slope, intercept) => (y - intercept) / slope;

const isSegmentIntersecting = ({ x1, y1, x2, y2 }, rect) => {
  if (x1 > rect.r && x2 > rect.r) {
    return false;
  }
  if (x1 < rect.l && x2 < rect.l) {
    return false;
  }
  if (y1 > rect.b && y2 > rect.b) {
    return false;
  }
  if (y1 < rect.t && y2 < rect.t) {
    return false;
  }
  if (isPointWithin(x1, y1, rect)) {
    return true;
  }
  if (isPointWithin(x2, y2, rect)) {
    return true;
  }
  const slope = (y2 - y1) / (x2 - x1);
  const intercept = y1 - x1 * slope;
  if (isInRange(getY(rect.l, slope, intercept), rect.t, rect.b)) {
    return true;
  }
  if (isInRange(getY(rect.r, slope, intercept), rect.t, rect.b)) {
    return true;
  }
  if (isInRange(getX(rect.t, slope, intercept), rect.l, rect.r)) {
    return true;
  }
  if (isInRange(getX(rect.b, slope, intercept), rect.l, rect.r)) {
    return true;
  }
  return false;
};

const getWirePoints = (nodes, { a, b }) => {
  const nodeA = findNode(nodes, a[0]);
  const nodeB = findNode(nodes, b[0]);
  const aPos = getPortPosition(nodeA)(a[1]);
  const bPos = getPortPosition(nodeB)(b[1]);
  return {
    x1: aPos[0],
    y1: aPos[1],
    x2: bPos[0],
    y2: bPos[1]
  };
};

export const getIntersectingWires = (wires, nodes, rect) =>
  wires.filter((wire) =>
    isSegmentIntersecting(getWirePoints(nodes, wire), rect)
  );

export const findNode = (nodes, nodeId) =>
  find(nodes, ({ id } = {}) => id === nodeId);
