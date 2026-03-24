import React from "react";
import { Handle, Position } from "@xyflow/react";

const ResultNode = ({ data }) => {
  return (
    <div className={`flow-node result-node ${data.loading ? "loading" : ""} ${data.response ? "has-response" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-handle" />
      <div className="node-header">
        <span className="node-tag result-tag">OUTPUT</span>
        <div className={`node-indicator ${data.loading ? "pulse" : data.response ? "active" : ""}`} />
      </div>
      <div className="node-label">AI Response</div>
      <div className="node-response">
        {data.loading ? (
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        ) : data.response ? (
          <p>{data.response}</p>
        ) : (
          <p className="placeholder-text">Response will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default ResultNode;
