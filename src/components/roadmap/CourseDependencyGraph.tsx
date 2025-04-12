import { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { FiRefreshCw, FiMove } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import SidebarDrawer from "./SidebarDrawer";

// Define MarkerType enum that matches ReactFlow's MarkerType
enum MarkerType {
  Arrow = "arrow",
  ArrowClosed = "arrowclosed",
}

// Custom types that match our JSON structure
export type NodeData = {
  label: string;
  questions?: string[];
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
  semester?: string;
  initialViewport?: { x: number; y: number; zoom: number };
}

const CourseDependencyGraphContent = ({
  nodes,
  edges,
  semester,
}: CourseDependencyGraphProps) => {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
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

  const togglePanning = useCallback(() => {
    setPanningEnabled((prev) => !prev);
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const closeSidebar = useCallback(() => {
    setSelectedNode(null);
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
    <div className="w-full h-full flex flex-col">
      {semester && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/${semester}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to {semester.toUpperCase()}</span>
          </Link>
        </div>
      )}

      <div
        ref={reactFlowWrapper}
        className="w-full flex-grow border border-slate-300 rounded-lg overflow-hidden"
      >
        <ReactFlow
          nodes={nonConnectableNodes}
          edges={enhancedEdges}
          defaultEdgeOptions={defaultEdgeOptions}
          nodesDraggable={false}
          panOnScroll={panningEnabled}
          zoomOnScroll={true}
          panOnDrag={panningEnabled}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          connectOnClick={false}
          nodesFocusable={true}
          edgesFocusable={false}
          elementsSelectable={true}
          nodesConnectable={false}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls showInteractive={false} />

          {/* Responsive Controls Panel */}
          <Panel
            position="top-right"
            className="flex flex-col md:flex-row gap-2"
          >
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
              onClick={togglePanning}
              title={panningEnabled ? "Disable Panning" : "Enable Panning"}
              aria-label={panningEnabled ? "Disable Panning" : "Enable Panning"}
            >
              <FiMove className={buttonIconClass} />
              <span className="sr-only md:not-sr-only md:ml-2">
                {panningEnabled ? "Lock Pan" : "Enable Pan"}
              </span>
            </button>
          </Panel>
        </ReactFlow>

        {/* Sidebar Drawer for Practice Questions */}
        <SidebarDrawer
          isOpen={selectedNode !== null}
          onClose={closeSidebar}
          topic={selectedNode?.data.label || ""}
          questions={selectedNode?.data.questions || []}
        />
      </div>
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
