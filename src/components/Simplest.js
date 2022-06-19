import Canvas from "../framework/components/Canvas";
import Node from "../framework/components/Node";
import Wire from "../framework/components/Wire";

const Simplest = () => (
  <Canvas>
    <Node id="one" x={0} y={0} />
    <Node id="two" />
    <Node id="three" />
    <Wire
      ports={[
        ["one", "out"],
        ["two", "in"]
      ]}
    />
    <Wire
      ports={[
        ["two", "out"],
        ["three", "in"]
      ]}
    />
  </Canvas>
);

export default Simplest;
