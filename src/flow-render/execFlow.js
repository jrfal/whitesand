const execFlow = (defs, steps, start = "first", payload, context) => {
  const step = steps[start];
  const def = defs[step.def];
  const { next, props, branches } = step;

  return new Promise((resolve, reject) => {
    def(payload, context, props)
      .then((response) => {
        const { payload: newPayload, context: addContext, branch } = response;
        if (branch) {
          // this is a branch step, move to next step in flow
          execFlow(defs, steps, branches[branch], newPayload, {
            ...context,
            ...addContext
          });
        } else {
          // execute next step
          execFlow(defs, steps, next, newPayload, {
            ...context,
            ...addContext
          });
        }
      })
      .then(() => {
        resolve();
      });
  });
};

export default execFlow;
