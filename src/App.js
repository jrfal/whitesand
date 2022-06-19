import React, { useReducer } from "react";
import model from "./reducers/model";
import StateRenderer from "./components/StateRenderer";
import Simplest from "./components/Simplest";
import CanvasState from "./framework/components/CanvasState";

const initState = {
  nodes: [
    { id: "first", name: "First", x: 40, y: 310 },
    { id: "second", name: "Second", x: 140, y: 350 },
    { id: "third", name: "Third", x: 440, y: 350 }
  ],
  wires: [{ a: ["first", "out"], b: ["second", "in"] }],
  selected: []
};

export default () => {
  const [state, dispatch] = useReducer(model, initState);

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <CanvasState width={window.innerWidth} height={window.innerHeight}>
      <StateRenderer
        state={state}
        dispatch={dispatch}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </CanvasState>
  );
};
