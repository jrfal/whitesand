import { find, filter, max, min, union, flatten, concat } from "lodash";
import {
  nodeWidth,
  nodeHeight,
  getPortPosition
} from "../../framework/components/Node";
import { findNode } from "../../framework/reducers/canvas/utils";

export const findWire = (wires, wireId) =>
  find(wires, ({ a, b }) => wireId === `${a}|${b}`);

export const updateWire = (wires, wireId, update) => [
  ...filter(wires, ({ a, b }) => wireId !== `${a}|${b}`),
  { ...findWire(wires, wireId), ...update }
];

export const updateNodes = (nodes, nodeIds, updateFn) =>
  nodes.map((node) => (nodeIds.includes(node.id) ? updateFn(node) : node));

const getWirePoints = (state, { a, b }) => {
  const nodeA = findNode(state.nodes, a[0]);
  const nodeB = findNode(state.nodes, b[0]);
  const aPos = getPortPosition(nodeA)(a[1]);
  const bPos = getPortPosition(nodeB)(b[1]);
  return {
    x1: aPos[0],
    y1: aPos[1],
    x2: bPos[0],
    y2: bPos[1]
  };
};

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

export const getIntersectingWires = (state, rect) =>
  state.wires.filter((wire) =>
    isSegmentIntersecting(getWirePoints(state, wire), rect)
  );

export const getBounds = (state) => {
  let [l, t, r, b] = [100000000, 100000000, 0, 0];

  state.nodes.forEach((element) => {
    l = min([element.x, l]);
    r = max([element.x + nodeWidth, r]);
    t = min([element.y, t]);
    b = max([element.y + nodeHeight, b]);
  });

  return {
    l,
    t,
    r,
    b
  };
};

export const moveNodeBy = ({ x, y }) => (node) => ({
  ...node,
  x: node.x + x,
  y: node.y + y
});

export const getNodeOffset = (node, x, y) => ({
  x: x - node.x,
  y: y - node.y
});

export const getLockedNodes = (state) => (nodeIds) => {
  const getLocked = (nodeId) =>
    state.wires
      .filter(
        ({ a, b, locked }) => locked && (a[0] === nodeId || b[0] === nodeId)
      )
      .map(({ a, b }) => (a[0] === nodeId ? b[0] : a[0]));

  let list = nodeIds;

  for (let i = 0; i < list.length; i++) {
    list = union(list, getLocked(list[i]));
  }

  return list;
};
