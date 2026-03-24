import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import "./App.css";
import InputNode from "./components/InputNode";
import ResultNode from "./components/ResultNode";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#7c6aff", strokeWidth: 2 },
  },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initialNodes = [
    {
      id: "1",
      type: "inputNode",
      position: { x: 80, y: 180 },
      data: { prompt: "", onChange: setPrompt },
    },
    {
      id: "2",
      type: "resultNode",
      position: { x: 560, y: 150 },
      data: { response: "", loading: false },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleRun = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt first.", "error");
      return;
    }
    setLoading(true);
    setSaveStatus(null);

    setNodes((nds) =>
      nds.map((node) =>
        node.id === "2"
          ? { ...node, data: { ...node.data, response: "", loading: true } }
          : node,
      ),
    );

    try {
      const res = await fetch(`${BACKEND_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setResponse(data.answer);
      setNodes((nds) =>
        nds.map((node) =>
          node.id === "2"
            ? {
                ...node,
                data: { ...node.data, response: data.answer, loading: false },
              }
            : node,
        ),
      );
      showToast("AI responded successfully!");
    } catch (err) {
      const errMsg = err.message || "Something went wrong.";
      setNodes((nds) =>
        nds.map((node) =>
          node.id === "2"
            ? {
                ...node,
                data: {
                  ...node.data,
                  response: `Error: ${errMsg}`,
                  loading: false,
                },
              }
            : node,
        ),
      );
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim() || !response) {
      showToast("Run the flow first before saving.", "error");
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch(`${BACKEND_URL}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveStatus("saved");
      showToast("Saved to MongoDB ✓");
    } catch (err) {
      setSaveStatus("error");
      showToast("Failed to save: " + err.message, "error");
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon
                points="14,2 26,8 26,20 14,26 2,20 2,8"
                stroke="#7c6aff"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="14" cy="14" r="4" fill="#7c6aff" />
              <line
                x1="14"
                y1="2"
                x2="14"
                y2="10"
                stroke="#ff6a9b"
                strokeWidth="1.5"
              />
              <line
                x1="26"
                y1="20"
                x2="19"
                y2="17"
                stroke="#ff6a9b"
                strokeWidth="1.5"
              />
              <line
                x1="2"
                y1="20"
                x2="9"
                y2="17"
                stroke="#ff6a9b"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="app-title">AI FLOW</span>
          <span className="app-subtitle">MERN · React Flow · OpenRouter</span>
        </div>
        <div className="header-actions">
          <button
            className={`btn btn-save ${saveStatus === "saved" ? "saved" : ""}`}
            onClick={handleSave}
            disabled={loading || saveStatus === "saving"}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "✓ Saved"
                : "Save to DB"}
          </button>
          <button
            className="btn btn-run"
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span />
                <span />
                <span />
              </span>
            ) : (
              "▶ Run Flow"
            )}
          </button>
        </div>
      </header>

      <div className="canvas-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#2a2a3d"
          />
          <Controls className="flow-controls" />
        </ReactFlow>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
