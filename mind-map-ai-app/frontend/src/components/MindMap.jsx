// src/components/MindMap.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./MindMap.css";

function MindMapInner({ nodes = [] }) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mindmapRef = useRef(null);

  // 🎨 Node styles by level
  const getNodeStyle = (level) => {
    const palette = [
      { bg: "#4f46e5", color: "#fff" }, // main heading
      { bg: "#a5b4fc", color: "#1e293b" }, // subheading
      { bg: "#eef2ff", color: "#1e293b" }, // info/details
    ];
    const c = palette[level] || palette[2];
    return {
      background: c.bg,
      color: c.color,
      borderRadius: "12px",
      padding: "10px 18px",
      width: level === 0 ? 260 : level === 1 ? 220 : 180,
      fontWeight: level === 0 ? 700 : level === 1 ? 600 : 500,
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    };
  };

  // 🧭 Section-island layout
  const generateLayout = (data) => {
    const formattedNodes = [];
    const formattedEdges = [];

    const LEVEL_X_SPACING = 280; // parent → child horizontal
    const LEVEL_Y_SPACING = 160; // sibling vertical spacing
    const SECTION_X_GAP = 900; // gap between sections horizontally
    const SECTION_Y_GAP = 700; // gap between sections vertically
    const SECTIONS_PER_ROW = 2; // grid columns

    const buildSubtree = (node, x, y, level = 0, parent = null) => {
      const id = node.id || node._id || `n-${Math.random().toString(36).slice(2, 9)}`;

      formattedNodes.push({
        id,
        position: { x, y },
        data: { label: node.title || node.label || "Untitled" },
        style: getNodeStyle(level),
      });

      if (parent) {
        formattedEdges.push({
          id: `e-${parent}-${id}`,
          source: parent,
          target: id,
          type: "smoothstep",
          style: { stroke: "#64748b", strokeWidth: 2 },
        });
      }

      if (node.children && node.children.length > 0) {
        const total = node.children.length;
        const totalHeight = (total - 1) * LEVEL_Y_SPACING;
        const startY = y - totalHeight / 2;

        node.children.forEach((child, i) => {
          const childX = x + LEVEL_X_SPACING;
          const childY = startY + i * LEVEL_Y_SPACING;
          buildSubtree(child, childX, childY, level + 1, id);
        });
      }
    };

    // Grid placement for multiple main headings
    if (Array.isArray(data)) {
      data.forEach((root, i) => {
        const row = Math.floor(i / SECTIONS_PER_ROW);
        const col = i % SECTIONS_PER_ROW;

        const sectionX = col * SECTION_X_GAP;
        const sectionY = row * SECTION_Y_GAP;

        buildSubtree(root, sectionX, sectionY, 0);
      });
    } else {
      buildSubtree(data, 0, 0, 0);
    }

    return { formattedNodes, formattedEdges };
  };

  useEffect(() => {
    if (!nodes || nodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { formattedNodes, formattedEdges } = generateLayout(nodes);
    setNodes(formattedNodes);
    setEdges(formattedEdges);

    // Smooth fitView
    setTimeout(() => fitView({ padding: 0.7, duration: 1200 }), 500);
  }, [nodes, fitView, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: "smoothstep", style: { stroke: "#64748b", strokeWidth: 2 } },
          eds
        )
      ),
    [setEdges]
  );

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!mindmapRef.current) return;
    if (!isFullscreen) mindmapRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`mindmap-container ${isFullscreen ? "fullscreen" : ""}`}
      ref={mindmapRef}
    >
      <div className="mindmap-controls">
        <button onClick={toggleFullscreen} className="fullscreen-btn">
          {isFullscreen ? "⬜ Exit Fullscreen" : "⛶ Fullscreen"}
        </button>
        <button
          onClick={() => fitView({ padding: 0.7, duration: 800 })}
          className="fit-btn"
        >
          🔍 Fit View
        </button>
      </div>

      {flowNodes.length > 0 ? (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.25}
          maxZoom={2}
        >
          <MiniMap nodeColor={(n) => n.style.background} position="bottom-left" />
          <Controls position="top-right" />
          <Background color="#e2e8f0" gap={25} variant="dots" />
        </ReactFlow>
      ) : (
        <div className="no-nodes-message">
          <div className="empty-emoji">🧠</div>
          <h3>No Mindmap Yet</h3>
          <p>Click “Generate Mindmap” to visualize your content clearly.</p>
        </div>
      )}
    </div>
  );
}

export default function MindMap({ nodes }) {
  return (
    <ReactFlowProvider>
      <MindMapInner nodes={nodes} />
    </ReactFlowProvider>
  );
}
