export const initial = {
  hoverRect: null,
  dragData: {},
  selectRect: null
};

export default (state = initial, action = {}) => {
  const { wires } = state;
  const { type, nodeId, port, toPort, toNodeId, nodeIds, rect } = action;

  switch (type) {
    case "LINK_NODES":
      return {
        wires: [...wires, { a: [nodeId, port], b: [toNodeId, toPort] }]
      };
    case "DELETE_NODES":
      return {
        wires: wires.filter(
          ({ a, b }) => !(nodeIds.includes(a) || nodeIds.includes(b))
        )
      };
    case "HOVER_RECT":
      return {
        ...state,
        hoverRect: rect
      };
    case "CLEAR_HOVER_RECT":
      return {
        ...state,
        hoverRect: null
      };
    case "DRAG_DATA":
      return {
        ...state,
        dragData: action.data
      };
    case "CLEAR_DRAG_DATA":
      return {
        ...state,
        dragData: {}
      };
    case "SELECT_RECT":
      return {
        ...state,
        selectRect: rect
      };
    case "CLEAR_SELECT_RECT":
      return {
        ...state,
        selectRect: null
      };
    default:
      return state;
  }
};
