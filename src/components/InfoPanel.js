import Draggable from "react-draggable";
import { findWire } from "../reducers/model/utils";
import { findNode } from "../framework/reducers/canvas/utils";
import { updateNodes, updateWire } from "../reducers/model/actions";
import FormBuilder from "./FormBuilder";
import TextList from "./TextList";
import { chain } from "lodash";
import { useCanvasState } from "../framework/components/CanvasState";

const allEqual = (values) => {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] !== values[i + 1]) {
      return false;
    }
  }

  return true;
};

const PropertyInput = ({
  property,
  handleNodeChange,
  hasMultiValues,
  nodeList
}) => (
  <input
    key={`input-${property}`}
    onChange={handleNodeChange(property)}
    value={hasMultiValues[property] ? "" : nodeList[0][property]}
    placeHolder={hasMultiValues[property] ? "[Multiple Values]" : ""}
  />
);

const PropertySelect = ({
  property,
  handleNodeChange,
  hasMultiValues,
  nodeList,
  ...props
}) => (
  <select
    key={`input-${property}`}
    onChange={handleNodeChange(property)}
    value={hasMultiValues[property] ? "" : nodeList[0][property]}
    placeHolder={hasMultiValues[property] ? "[Multiple Values]" : ""}
    {...props}
  />
);

const InfoPanel = ({ state, dispatch }) => {
  const { selected, setSelected } = useCanvasState();
  const { nodes = [], wires = [] } = selected || {};

  if (nodes.length || wires.length) {
    const nodeList = nodes.map((nodeId) => findNode(state.nodes, nodeId) || {});

    const handleNodeChange = (property) => (event) => {
      dispatch(
        updateNodes(
          nodeList.map(({ id }) => ({
            id,
            [property]: event.target ? event.target.value : event
          }))
        )
      );
    };

    const handleLockWire = (wireId) => (event) => {
      dispatch(updateWire(wireId, { locked: event.target.checked }));
    };

    const hasMultiValues = {
      name: !allEqual(nodeList.map(({ name }) => name)),
      color: !allEqual(nodeList.map(({ color }) => color))
    };

    const renderPropertyInput = (property) => (
      <PropertyInput
        {...{ property, hasMultiValues, handleNodeChange, nodeList }}
      />
    );

    const renderPropertySelect = (property, children) => (
      <PropertySelect
        {...{ property, hasMultiValues, handleNodeChange, nodeList, children }}
      />
    );

    return (
      <Draggable>
        <div
          style={{
            width: 200,
            background: "yellow",
            padding: "10px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {`${nodes.length} node${nodes.length !== 1 ? "s" : ""} and ${
            wires.length
          } wire${wires.length !== 1 ? "s" : ""}`}
          {nodes.length > 0 &&
            wires.length === 0 && [
              renderPropertyInput("name"),
              renderPropertyInput("color"),
              renderPropertySelect("type", [
                <option value="form">Form</option>,
                <option value="oneButton">One Button</option>,
                <option value="upAndDown">Up and Down</option>,
                <option value="multiButtons">Multibuttons</option>,
                <option value="report">Report</option>,
                <option value="setContext">Set Context</option>
              ])
            ]}
          {wires.length === 1 && nodes.length === 0 && (
            <label>
              <input
                type="checkbox"
                checked={!!findWire(state.wires, wires[0]).locked}
                onChange={handleLockWire(wires[0])}
              />
              Lock wire
            </label>
          )}
          {nodes.length > 0 &&
            chain(nodeList).filter({ type: "form" }).value().length > 0 && (
              <FormBuilder
                value={nodeList[0].form}
                onChange={handleNodeChange("form")}
              />
            )}
          {nodes.length > 0 &&
            chain(nodeList).filter({ type: "multiButtons" }).value().length >
              0 && (
              <TextList
                value={nodeList[0].buttons}
                onChange={handleNodeChange("buttons")}
              />
            )}
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      </Draggable>
    );
  }
  return null;
};

export default InfoPanel;
