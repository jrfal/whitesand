import React from "react";

export default (payload, context, props = {}) => {
  const { reactRender } = context;

  return new Promise((resolve, reject) => {
    const submitted = () => resolve({});
    reactRender(
      <>
        {props.name}
        <button onClick={submitted} {...props}>
          Next
        </button>
      </>
    );
  });
};
