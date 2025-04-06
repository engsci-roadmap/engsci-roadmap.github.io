import { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  FiRefreshCw,
  FiLock,
  FiUnlock,
  FiMove,
  FiZoomIn,
} from "react-icons/fi";

// Define MarkerType enum that matches ReactFlow's MarkerType
enum MarkerType {
  Arrow = "arrow",
  ArrowClosed = "arrowclosed",
}

// Custom types that match our JSON structure
export type NodeData = {
  label: string;
};

export type NodePosition = {
  x: number;
  y: number;
};

export type GraphNode = {
  id: string;
  data: NodeData;
  position: NodePosition;
  type: string;
  connectable?: boolean;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

interface CourseDependencyGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  title?: string;
  initialViewport?: { x: number; y: number; zoom: number };
}

const CourseDependencyGraphContent = ({
  nodes,
  edges,
}: CourseDependencyGraphProps) => {
  const [nodesDraggable, setNodesDraggable] = useState(true);
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [zoomingEnabled, setZoomingEnabled] = useState(true);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Add connectable: false to all nodes
  const nonConnectableNodes = nodes.map((node) => ({
    ...node,
    connectable: false,
  }));

  // Create curved, directed edges with arrows
  const enhancedEdges = edges.map((edge) => ({
    ...edge,
    type: "default",
    animated: false,
    style: { strokeWidth: 1.5, stroke: "#555" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: "#555",
    },
  }));

  // Center graph on mount and when data changes
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [nodes.length, reactFlowInstance]);

  const resetView = useCallback(() => {
    // Center the view on the graph
    reactFlowInstance.fitView({
      padding: 0.2,
      duration: 500,
    });
  }, [reactFlowInstance]);

  const toggleDragging = useCallback(() => {
    setNodesDraggable((prev) => !prev);
  }, []);

  const togglePanning = useCallback(() => {
    setPanningEnabled((prev) => !prev);
  }, []);

  const toggleZooming = useCallback(() => {
    setZoomingEnabled((prev) => !prev);
  }, []);

  // Responsive button styles
  const buttonClass =
    "flex items-center justify-center p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shadow-sm";
  const buttonIconClass = "text-xl"; // Larger icons for better mobile touch targets

  const defaultEdgeOptions = {
    type: "bezier", // Use bezier for curved lines
    style: { strokeWidth: 1.5, stroke: "#555" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#555",
    },
  };

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full border border-slate-300 rounded-lg overflow-hidden"
    >
      <ReactFlow
        nodes={nonConnectableNodes}
        edges={enhancedEdges}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={nodesDraggable}
        panOnScroll={panningEnabled}
        zoomOnScroll={zoomingEnabled}
        panOnDrag={panningEnabled}
        zoomOnPinch={zoomingEnabled}
        zoomOnDoubleClick={zoomingEnabled}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        connectOnClick={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        nodesConnectable={false}
        nodeDragHandleClassName="hidden"
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap />

        {/* Responsive Controls Panel */}
        <Panel position="top-right" className="flex flex-col md:flex-row gap-2">
          <button
            className={buttonClass}
            onClick={resetView}
            title="Reset View"
            aria-label="Reset View"
          >
            <FiRefreshCw className={buttonIconClass} />
            <span className="sr-only md:not-sr-only md:ml-2">Reset</span>
          </button>

          <button
            className={buttonClass}
            onClick={toggleDragging}
            title={nodesDraggable ? "Lock Nodes" : "Unlock Nodes"}
            aria-label={nodesDraggable ? "Lock Nodes" : "Unlock Nodes"}
          >
            {nodesDraggable ? (
              <FiUnlock className={buttonIconClass} />
            ) : (
              <FiLock className={buttonIconClass} />
            )}
            <span className="sr-only md:not-sr-only md:ml-2">
              {nodesDraggable ? "Lock" : "Unlock"}
            </span>
          </button>

          <button
            className={buttonClass}
            onClick={togglePanning}
            title={panningEnabled ? "Disable Panning" : "Enable Panning"}
            aria-label={panningEnabled ? "Disable Panning" : "Enable Panning"}
          >
            <FiMove className={buttonIconClass} />
            <span className="sr-only md:not-sr-only md:ml-2">
              {panningEnabled ? "Lock Pan" : "Enable Pan"}
            </span>
          </button>

          <button
            className={buttonClass}
            onClick={toggleZooming}
            title={zoomingEnabled ? "Disable Zooming" : "Enable Zooming"}
            aria-label={zoomingEnabled ? "Disable Zooming" : "Enable Zooming"}
          >
            <FiZoomIn className={buttonIconClass} />
            <span className="sr-only md:not-sr-only md:ml-2">
              {zoomingEnabled ? "Lock Zoom" : "Enable Zoom"}
            </span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrap with ReactFlowProvider to properly export the component
export const CourseDependencyGraph = (props: CourseDependencyGraphProps) => (
  <ReactFlowProvider>
    <CourseDependencyGraphContent {...props} />
  </ReactFlowProvider>
);

export default CourseDependencyGraph;
