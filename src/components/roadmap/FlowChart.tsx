import { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import useNodesState from "reactflow";
import useEdgesState from "reactflow";
import useReactFlow from "reactflow";
import "reactflow/dist/style.css";
// Import icons for visual clarity
import {
  FaSyncAlt,
  FaArrowsAlt,
  FaHandPaper,
  FaSearchPlus,
} from "react-icons/fa";

interface FlowChartProps {
  jsonPath: string;
}

const FlowChart = ({ jsonPath }: FlowChartProps) => {
  // State variables for nodes, edges, and UI toggles
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isPannable, setIsPannable] = useState(true);
  const [isZoomable, setIsZoomable] = useState(true);
  // Additional states for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();

  // The following useEffect fetches the roadmap data and updates the UI states accordingly.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define multiple paths for compatibility between development and production
        const paths = [
          `/data/roadmaps/${jsonPath}`,
          `/src/data/roadmaps/${jsonPath}`,
          `./data/roadmaps/${jsonPath}`,
        ];

        let data = null;
        // Attempt to fetch data from each defined path until successful
        for (const path of paths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch {
            // Continue to next path if an error occurs
          }
        }

        // Update state based on data retrieval success
        if (data) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setLoading(false);
        } else {
          setError(`Failed to load roadmap data for: ${jsonPath}`);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading roadmap data:", error);
        setError("An error occurred while loading data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [jsonPath, setNodes, setEdges]);

  // The next section defines callbacks for resetting the view and toggling interactions.
  const resetGraph = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }, [reactFlowInstance]);

  const toggleDragging = useCallback(() => {
    setIsDraggable((prev) => !prev);
  }, []);

  const togglePanning = useCallback(() => {
    setIsPannable((prev) => !prev);
  }, []);

  const toggleZooming = useCallback(() => {
    setIsZoomable((prev) => !prev);
  }, []);

  // This section provides user feedback by displaying a loading message or an error alert when appropriate.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  // The main return statement renders the ReactFlow component along with improved control panels.
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={isDraggable}
      panOnScroll={isPannable}
      panOnDrag={isPannable}
      zoomOnScroll={isZoomable}
      zoomOnPinch={isZoomable}
      zoomOnDoubleClick={isZoomable}
      fitView
    >
      <Background />
      <MiniMap />
      {isZoomable && <Controls />}

      {/* Desktop Control Panel with horizontal layout */}
      <Panel
        position="top-center"
        className="hidden md:flex space-x-4 p-2 bg-white rounded shadow"
      >
        <button
          onClick={resetGraph}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          aria-label="Reset View"
        >
          <FaSyncAlt className="mr-2" />
          Reset View
        </button>
        <button
          onClick={toggleDragging}
          className={`flex items-center px-4 py-2 rounded transition ${
            isDraggable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isDraggable ? "Disable dragging" : "Enable dragging"}
        >
          <FaArrowsAlt className="mr-2" />
          {isDraggable ? "Dragging On" : "Dragging Off"}
        </button>
        <button
          onClick={togglePanning}
          className={`flex items-center px-4 py-2 rounded transition ${
            isPannable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isPannable ? "Disable panning" : "Enable panning"}
        >
          <FaHandPaper className="mr-2" />
          {isPannable ? "Panning On" : "Panning Off"}
        </button>
        <button
          onClick={toggleZooming}
          className={`flex items-center px-4 py-2 rounded transition ${
            isZoomable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isZoomable ? "Disable zooming" : "Enable zooming"}
        >
          <FaSearchPlus className="mr-2" />
          {isZoomable ? "Zooming On" : "Zooming Off"}
        </button>
      </Panel>

      {/* Mobile Control Panel with vertical layout */}
      <Panel
        position="top-right"
        className="md:hidden flex flex-col space-y-2 p-2 bg-white rounded shadow-md"
      >
        <button
          onClick={resetGraph}
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          aria-label="Reset View"
        >
          <FaSyncAlt className="mr-1" />
          Reset View
        </button>
        <button
          onClick={toggleDragging}
          className={`flex items-center px-3 py-1 rounded transition text-sm ${
            isDraggable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isDraggable ? "Disable dragging" : "Enable dragging"}
        >
          <FaArrowsAlt className="mr-1" />
          {isDraggable ? "Drag: On" : "Drag: Off"}
        </button>
        <button
          onClick={togglePanning}
          className={`flex items-center px-3 py-1 rounded transition text-sm ${
            isPannable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isPannable ? "Disable panning" : "Enable panning"}
        >
          <FaHandPaper className="mr-1" />
          {isPannable ? "Pan: On" : "Pan: Off"}
        </button>
        <button
          onClick={toggleZooming}
          className={`flex items-center px-3 py-1 rounded transition text-sm ${
            isZoomable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isZoomable ? "Disable zooming" : "Enable zooming"}
        >
          <FaSearchPlus className="mr-1" />
          {isZoomable ? "Zoom: On" : "Zoom: Off"}
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default FlowChart;
