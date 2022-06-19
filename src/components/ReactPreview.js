import React from "react";
import FlowRender from "../flow-render/FlowRender";
import oneButton from "../flow-render/defs/oneButton";
import multiButtons from "../flow-render/defs/multiButtons";
import report from "../flow-render/defs/report";
import form from "../flow-render/defs/form";
import setContext from "../flow-render/defs/setContext";
import { keyBy, mapValues } from "lodash";

const defs = {
  oneButton,
  upAndDown: multiButtons,
  form,
  multiButtons,
  report,
  setContext
};

const portsMatch = ([aNode, aPort], [bNode, bPort]) =>
  aNode === bNode && aPort === bPort;

const wireFromPort = (id, port) => (wire) =>
  portsMatch(wire.a, [id, port]) || portsMatch(wire.b, [id, port]);

const getOtherNode = (port) => (wire) =>
  wire.a[1] === port ? wire.b[0] : wire.a[0];

const makeStep = (wires) => ({ id, name, form, buttons, type = "form" }) => {
  const outPorts =
    type === "upAndDown"
      ? ["up", "down"]
      : type === "multiButtons"
      ? buttons
      : ["out"];
  const nextList = wires
    .filter(wireFromPort(id, "out"))
    .map(getOtherNode("out"));
  const nextProps =
    type === "upAndDown" || type === "multiButtons"
      ? {
          branches: mapValues(
            keyBy(outPorts, (port) => port),
            (port) => {
              const wire = wires
                .filter(wireFromPort(id, port))
                .map(getOtherNode(port));
              return wire.length > 0 ? wire[0] : undefined;
            }
          )
        }
      : {
          next: nextList.length ? nextList[0] : undefined
        };

  return {
    def: type,
    props: {
      name,
      form,
      buttons: type === "upAndDown" ? ["up", "down"] : buttons
    },
    ...nextProps
  };
};

const makeFlow = (state) => {
  let flow = {};

  state.nodes.forEach((node) => {
    flow[node.id] = makeStep(state.wires)(node);
  });

  return flow;
};

const getFirst = (flow) =>
  Object.keys(flow).filter(
    (key) =>
      Object.keys(flow).filter(
        (key2) =>
          flow[key2].next === key ||
          (flow[key2].branches &&
            Object.values(flow[key2].branches).includes(key))
      ).length <= 0
  )[0];

const ReactPreview = ({ state }) => {
  const flow = makeFlow(state);
  console.log(flow, getFirst(flow));

  return (
    <div>
      <FlowRender defs={defs} steps={flow} start={getFirst(flow)} />
    </div>
  );
};

export default ReactPreview;
