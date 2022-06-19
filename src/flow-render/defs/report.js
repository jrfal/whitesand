import React from "react";

export default (payload, context, props = {}) => {
  const { reactRender } = context;
  console.log(context);

  return new Promise((resolve, reject) => {
    const submitted = () => resolve({});

    reactRender(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <pre>{JSON.stringify(payload, null, " ")}</pre>
        <pre>{JSON.stringify(context, null, " ")}</pre>
        <button onClick={submitted} {...props}>
          Next
        </button>
      </div>
    );
  });
};
