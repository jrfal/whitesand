import React from "react";

export default (payload, context, props = {}) => {
  const { reactRender } = context;
  const { name, buttons, ...rest } = props;

  return new Promise((resolve, reject) => {
    const submitted = (key) => () => resolve({ branch: key });
    reactRender(
      <>
        {name}
        {buttons.map((label) => (
          <button onClick={submitted(label)} {...rest}>
            {label}
          </button>
        ))}
      </>
    );
  });
};
