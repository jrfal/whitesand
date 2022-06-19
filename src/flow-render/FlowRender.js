import React, { useState } from "react";
import execFlow from "./execFlow";

const FlowRender = ({ defs, steps, start }) => {
  const [content, setContent] = useState(null);

  if (content === null) {
    execFlow(defs, steps, start, {}, { reactRender: setContent });
  }

  return (
    <div>
      {content} <button onClick={() => setContent(null)}>reset</button>
    </div>
  );
};

export default FlowRender;
