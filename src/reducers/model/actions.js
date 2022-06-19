export const updateNodeAction = (nodeId, properties) => ({
  type: "UPDATE_NODE",
  nodeId,
  properties
});

export const updateNodes = (nodes) => ({
  type: "UPDATE_NODES",
  nodes
});

export const updateWire = (wireId, properties) => ({
  type: "UPDATE_WIRE",
  wireId,
  properties
});

export const moveNode = (nodeId, x, y, nodeIds) => ({
  type: "MOVE_NODE",
  nodeId,
  x,
  y,
  nodeIds
});

export const linkNodes = (a, aPort, b, bPort) => ({
  type: "LINK_NODES",
  nodeId: a,
  port: aPort,
  toNodeId: b,
  toPort: bPort
});

export const deleteNodes = (nodeIds) => ({
  type: "DELETE_NODES",
  nodeIds
});

export const addNode = (x, y, name) => ({
  type: "ADD_NODE",
  x,
  y,
  name
});

export const deleteSelected = () => ({
  type: "DELETE_SELECTED"
});

export const deleteThings = (nodeIds, wireIds) => ({
  type: "DELETE_THINGS",
  nodeIds,
  wireIds
});

export const toggleSelectNode = (nodeId) => ({
  type: "TOGGLE_SELECT_NODE",
  nodeId
});

export const toggleSelectWire = (wireId) => ({
  type: "TOGGLE_SELECT_WIRE",
  wireId
});

export const deselectAll = () => ({ type: "DESELECT_ALL" });

export const setSelected = (selected) => ({ type: "SET_SELECTED", selected });
