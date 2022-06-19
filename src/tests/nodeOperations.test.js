import { moveNode } from "../reducers/model/actions";
import model from "../reducers/model";
import { findNode } from "../framework/reducers/canvas/utils";

const testState2 = {
  nodes: [
    {
      id: "a",
      x: 30,
      y: 60
    },
    {
      id: "b",
      x: 200,
      y: 60
    }
  ],
  wires: []
};

const moveAction = moveNode("a", 20, 30);

it("should have the new location for a moved node", () => {
  const state = model(testState2, moveAction);
  const node = findNode(state.nodes, "a");
  expect(node.x).toBe(20);
  expect(node.y).toBe(30);
});

it("should have still have the unaffected node after a moved node", () => {
  const state = model(testState2, moveAction);
  const node = findNode(state.nodes, "b");
  expect(node.x).toBe(200);
  expect(node.y).toBe(60);
});
