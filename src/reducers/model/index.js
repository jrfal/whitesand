import { xor, max, min, union } from "lodash";
import { v4 as uuid } from "uuid";
import {
  updateNode,
  updateNodes,
  updateWire,
  moveNodeBy,
  getNodeOffset,
  getLockedNodes
} from "./utils";
import { findNode } from "../../framework/reducers/canvas/utils";

const initial = {
  nodes: [],
  wires: []
};

export default (state = initial, action = {}) => {
  const { nodes, wires } = state;
  const {
    name,
    type,
    nodeId,
    port,
    toPort,
    x,
    y,
    toNodeId,
    nodeIds,
    nodes: nodesData,
    properties,
    wireId,
    wireIds
  } = action;

  switch (type) {
    case "MOVE_NODE":
      return {
        ...state,
        nodes: updateNodes(
          nodes,
          getLockedNodes(state)(union([nodeId], nodeIds)),
          moveNodeBy(getNodeOffset(findNode(nodes, nodeId), x, y))
        )
      };
    case "LINK_NODES":
      return {
        ...state,
        wires: [...wires, { a: [nodeId, port], b: [toNodeId, toPort] }]
      };
    case "DELETE_NODES":
      return {
        nodes: nodes.filter(({ id }) => !nodeIds.includes(id)),
        wires: wires.filter(
          ({ a, b }) => !(nodeIds.includes(a[0]) || nodeIds.includes(b[0]))
        )
      };
    case "DELETE_THINGS":
      return {
        nodes: nodes.filter(({ id }) => !nodeIds.includes(id)),
        wires: wires.filter(
          ({ a, b }) =>
            !(
              nodeIds.includes(a[0]) ||
              nodeIds.includes(b[0]) ||
              wireIds.includes(`${a.join(",")}|${b.join(",")}`)
            )
        )
      };
    case "ADD_NODE":
      return {
        nodes: [
          ...nodes,
          {
            id: uuid(),
            x,
            y,
            name,
            type: "oneButton"
          }
        ],
        wires
      };
    case "UPDATE_NODE":
      return {
        ...state,
        nodes: updateNode(nodes, nodeId, properties)
      };
    case "UPDATE_NODES":
      return {
        ...state,
        nodes: updateNodes(
          nodes,
          nodesData.map(({ id }) => id),
          (node) => ({
            ...node,
            ...findNode(nodesData, node.id)
          })
        )
      };
    case "UPDATE_WIRE":
      return {
        ...state,
        wires: updateWire(wires, wireId, properties)
      };
    default:
      return state;
  }
};
