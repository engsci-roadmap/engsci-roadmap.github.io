import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import graphData from "../../data/roadmaps/ESC180.json";

// Define type for control button props
interface ControlButtonProps {
  onClick: () => void;
  active: boolean;
  label: string;
  icon: string;
}

// Separate the flow component to use hooks inside ReactFlowProvider
const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Interactive controls state
  const [isDraggable, setIsDraggable] = useState(true);
  const [isPannable, setIsPannable] = useState(true);
  const [isZoomable, setIsZoomable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const reactFlowInstance = useReactFlow();

  // Initialize graph from JSON data
  useEffect(() => {
    setNodes(graphData.nodes);

    // Add directed markers to all edges
    const directedEdges = graphData.edges.map((edge) => ({
      ...edge,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#888",
      },
      style: { stroke: "#888" },
    }));

    setEdges(directedEdges);
  }, [setNodes, setEdges]);

  // Check if mobile view on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Reset graph to initial positions
  const handleResetGraph = useCallback(() => {
    if (reactFlowInstance) {
      // Center the graph with a reasonable zoom level
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: true });

      // Reset nodes to original positions
      setNodes(graphData.nodes);
    }
  }, [reactFlowInstance, setNodes]);

  // Toggle node dragging
  const handleToggleDragging = useCallback(() => {
    setIsDraggable(!isDraggable);
  }, [isDraggable]);

  // Toggle viewport panning
  const handleTogglePanning = useCallback(() => {
    setIsPannable(!isPannable);
  }, [isPannable]);

  // Toggle zooming
  const handleToggleZooming = useCallback(() => {
    setIsZoomable(!isZoomable);
  }, [isZoomable]);

  // Button component for controls
  const ControlButton = ({
    onClick,
    active,
    label,
    icon,
  }: ControlButtonProps) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${isMobile ? "w-full mb-2" : "mr-2"}`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={isDraggable}
      panOnScroll={isPannable}
      zoomOnScroll={isZoomable}
      panOnDrag={isPannable}
      zoomOnPinch={isZoomable}
      zoomOnDoubleClick={isZoomable}
      fitView
      attributionPosition="bottom-right"
    >
      <Background />
      <MiniMap />
      {isZoomable && <Controls />}

      <Panel position="top-right" className={isMobile ? "max-w-[120px]" : ""}>
        <div
          className={`bg-white p-2 rounded-md shadow-md ${
            isMobile ? "flex flex-col" : "flex flex-row"
          }`}
        >
          <ControlButton
            onClick={handleResetGraph}
            active={false}
            label="Reset"
            icon="🔁"
          />
          <ControlButton
            onClick={handleToggleDragging}
            active={isDraggable}
            label="Drag"
            icon="🧲"
          />
          <ControlButton
            onClick={handleTogglePanning}
            active={isPannable}
            label="Pan"
            icon="✋"
          />
          <ControlButton
            onClick={handleToggleZooming}
            active={isZoomable}
            label="Zoom"
            icon="🔍"
          />
        </div>
      </Panel>
    </ReactFlow>
  );
};

// Main component that wraps FlowChart with ReactFlowProvider
const ESC180 = () => {
  return (
    <div className="w-full h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex flex-col">
      <div className="relative flex-grow w-full">
        <ReactFlowProvider>
          <FlowChart />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ESC180;
