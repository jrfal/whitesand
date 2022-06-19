import { getBounds } from "../reducers/model/utils";
import { addNode, moveNode } from "../reducers/model/actions";
import model from "../reducers/model";
import { nodeWidth, nodeHeight } from "../framework/components/Node";

const testState = {
  nodes: [
    {
      id: "a",
      x: 30,
      y: 60
    }
  ],
  wires: []
};

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

it("should calculate right bounds", () => {
  const bounds = getBounds(testState);
  expect(bounds.l).toBe(30);
  expect(bounds.t).toBe(60);
  expect(bounds.r).toBe(30 + nodeWidth);
  expect(bounds.b).toBe(60 + nodeHeight);
});

it("should calculate right bounds for two nodes", () => {
  const bounds = getBounds(testState2);
  expect(bounds.l).toBe(30);
  expect(bounds.t).toBe(60);
  expect(bounds.r).toBe(200 + nodeWidth);
  expect(bounds.b).toBe(60 + nodeHeight);
});

it("should calculate right bounds for two nodes in reverse order", () => {
  const state = {
    nodes: [testState2.nodes[1], testState2.nodes[0]]
  };
  const bounds = getBounds(state);
  expect(bounds.l).toBe(30);
  expect(bounds.t).toBe(60);
  expect(bounds.r).toBe(200 + nodeWidth);
  expect(bounds.b).toBe(60 + nodeHeight);
});

it("should still calculate the right bound after adding a node", () => {
  const action = addNode(100, 100);
  const state = model(testState, action);
  const bounds = getBounds(state);
  expect(bounds.l).toBe(30);
  expect(bounds.t).toBe(60);
  expect(bounds.r).toBe(100 + nodeWidth);
  expect(bounds.b).toBe(100 + nodeHeight);
});

it("should still calculate the right bound after moving a node", () => {
  const action = moveNode("a", 20, 50);
  const state = model(testState2, action);
  const bounds = getBounds(state);
  expect(bounds.l).toBe(20);
  expect(bounds.t).toBe(50);
  expect(bounds.r).toBe(200 + nodeWidth);
  expect(bounds.b).toBe(60 + nodeHeight);
});
