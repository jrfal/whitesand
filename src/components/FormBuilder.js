import React from "react";
import { v4 as uuid } from "uuid";

const FormBuilder = ({ value = [], onChange }) => {
  const handleAdd = () =>
    onChange([...value, { id: uuid(), name: "", type: "Text" }]);

  const handleRemove = (index) => () =>
    onChange([...value.slice(0, index), ...value.slice(index + 1)]);

  const handleChange = (index, key) => (event) =>
    onChange([
      ...value.slice(0, index),
      { ...value[index], [key]: event.target.value },
      ...value.slice(index + 1)
    ]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label>Form</label>
      {value.map((field, index) => (
        <div key={field.id}>
          <input
            placeHolder="Name"
            value={field.name}
            onChange={handleChange(index, "name")}
          />
          <select value={field.type} onChange={handleChange(index, "type")}>
            <option>Text</option>
          </select>
          <button onClick={handleRemove(index)}>x</button>
        </div>
      ))}
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default FormBuilder;
