import React, { useState } from "react";

const Form = ({ submit }) => {
  const [formState, setFormState] = useState({
    contextKey: "",
    contextValue: ""
  });

  const onChange = (key) => (event) => {
    setFormState({
      ...formState,
      [key]: event.target.value
    });
  };

  return (
    <>
      <input
        placeHolder="Key"
        value={formState.contextKey}
        onChange={onChange("contextKey")}
      />
      <input
        placeHolder="Value"
        value={formState.contextValue}
        onChange={onChange("contextValue")}
      />
      <button onClick={() => submit(formState)}>Next</button>
    </>
  );
};

export default (payload, context, props = {}) => {
  const { reactRender } = context;

  return new Promise((resolve, reject) => {
    const submitted = (data) =>
      resolve({ context: { [data.contextKey]: data.contextValue } });

    reactRender(
      <div style={{ display: "flex", flexDirection: "column" }}>
        Set Context: {props.name}
        <Form submit={submitted} />
      </div>
    );
  });
};
