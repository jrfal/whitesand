import React from "react";
import { v4 as uuid } from "uuid";

const TextList = ({ value = [], onChange }) => {
  const handleAdd = () => onChange([...value, ""]);

  const handleRemove = (index) => () =>
    onChange([...value.slice(0, index), ...value.slice(index + 1)]);

  const handleChange = (index) => (event) =>
    onChange([
      ...value.slice(0, index),
      event.target.value,
      ...value.slice(index + 1)
    ]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label>Buttons</label>
      {value.map((item, index) => (
        <div key={index}>
          <input
            placeHolder="Button"
            value={item}
            onChange={handleChange(index, "name")}
          />
          <button onClick={handleRemove(index)}>x</button>
        </div>
      ))}
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default TextList;
