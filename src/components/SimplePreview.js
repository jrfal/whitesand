import React, { useState } from "react";

const makeStep = (wires) => (node) => ({
  ...node,
  next: wires.filter((wire) => wire.a === node.id).map((wire) => wire.b)
});

const makeFlow = (state) => state.nodes.map(makeStep(state.wires));

const hasInputs = (flow) => (step) =>
  flow.filter(({ next }) => next.includes(step.id)).length > 0;

const getFirst = (flow) => flow.filter((step) => !hasInputs(flow)(step))[0];

const getStep = (flow) => (stepId) => flow.filter(({ id }) => id === stepId)[0];

const SimplePreview = ({ state }) => {
  const flow = makeFlow(state);
  const [active, setActive] = useState(getFirst(flow).id);

  const step = getStep(flow)(active);

  return (
    <div>
      <p>Step: {step.name}</p>
      {step.next.map((nextStep) => (
        <button onClick={() => setActive(nextStep)}>
          {getStep(flow)(nextStep).name}
        </button>
      ))}
    </div>
  );
};

export default SimplePreview;
