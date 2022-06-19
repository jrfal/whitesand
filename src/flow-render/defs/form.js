import React, { useState } from "react";

const Form = ({ fields, submit }) => {
  const [formState, setFormState] = useState({});

  const onChange = (key) => (event) => {
    setFormState({
      ...formState,
      [key]: event.target.value
    });
  };

  return (
    <>
      {fields.map((field) => (
        <input
          placeHolder={field.name}
          value={formState[field.name]}
          onChange={onChange(field.name)}
        />
      ))}
      <button onClick={() => submit(formState)}>Next</button>
    </>
  );
};

export default (payload, context, props = {}) => {
  const { reactRender } = context;

  return new Promise((resolve, reject) => {
    const submitted = (data) => resolve({ payload: data });
    const { form = [] } = props;

    reactRender(
      <div style={{ display: "flex", flexDirection: "column" }}>
        Form: {props.name}
        <Form fields={form} submit={submitted} />
      </div>
    );
  });
};
