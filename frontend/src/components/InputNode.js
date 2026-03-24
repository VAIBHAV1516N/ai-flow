import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

const InputNode = ({ data }) => {
  const [localValue, setLocalValue] = useState(data.prompt || "");

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    data.onChange(val);
  };

  return (
    <div className="flow-node input-node">
      <div className="node-header">
        <span className="node-tag">INPUT</span>
        <div className="node-indicator" />
      </div>
      <div className="node-label">Prompt</div>
      <textarea
        className="node-textarea"
        value={localValue}
        onChange={handleChange}
        placeholder="Ask anything..."
        rows={5}
      />
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </div>
  );
};

export default InputNode;
