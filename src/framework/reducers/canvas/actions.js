export const deleteNodes = (nodeIds) => ({
  type: "DELETE_NODES",
  nodeIds
});

export const setHoverRect = (rect) => ({
  type: "HOVER_RECT",
  rect
});

export const clearHoverRect = {
  type: "CLEAR_HOVER_RECT"
};

export const setDragData = (data) => ({
  type: "DRAG_DATA",
  data
});

export const clearDragData = {
  type: "CLEAR_DRAG_DATA"
};

export const setSelectRect = (rect) => ({
  type: "SELECT_RECT",
  rect
});

export const clearSelectRect = {
  type: "CLEAR_SELECT_RECT"
};

export const setSelected = (selected) => ({
  type: "SET_SELECTED",
  selected
});
