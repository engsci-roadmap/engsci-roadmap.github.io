import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Import the JSON data via direct import
// We'll use fetch instead for better compatibility
// import ESC180Data from "@/data/roadmaps/ESC180.json";

interface FlowChartProps {
  jsonPath: string;
}

const FlowChart = ({ jsonPath }: FlowChartProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isPannable, setIsPannable] = useState(true);
  const [isZoomable, setIsZoomable] = useState(true);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    // Extract course code from the path
    const courseCode = jsonPath.replace(".json", "");

    const fetchData = async () => {
      try {
        // Try different paths to handle both development and production
        const paths = [
          `/src/data/roadmaps/${courseCode}.json`, // Dev path
          `/data/roadmaps/${courseCode}.json`, // Prod path with public folder
          `./data/roadmaps/${courseCode}.json`, // Alternative relative path
        ];

        let data = null;

        // Try each path until one works
        for (const path of paths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch (e) {
            // Continue to next path
          }
        }

        // If we have data, use it
        if (data) {
          setNodes(data.nodes);
          setEdges(data.edges);
        } else {
          // Fallback to hardcoded data for ESC180
          if (courseCode === "ESC180") {
            // Use hardcoded ESC180 data as fallback
            const fallbackData = {
              nodes: [
                {
                  id: "intro",
                  type: "default",
                  data: { label: "Introduction to Programming" },
                  position: { x: 250, y: 0 },
                },
                {
                  id: "variables",
                  type: "default",
                  data: { label: "Variables and Data Types" },
                  position: { x: 100, y: 100 },
                },
                {
                  id: "control",
                  type: "default",
                  data: { label: "Control Flow" },
                  position: { x: 400, y: 100 },
                },
                {
                  id: "functions",
                  type: "default",
                  data: { label: "Functions" },
                  position: { x: 250, y: 200 },
                },
              ],
              edges: [
                { id: "e1", source: "intro", target: "variables" },
                { id: "e2", source: "intro", target: "control" },
                { id: "e3", source: "variables", target: "functions" },
                { id: "e4", source: "control", target: "functions" },
              ],
            };
            setNodes(fallbackData.nodes);
            setEdges(fallbackData.edges);
          }
        }
      } catch (error) {
        console.error("Error loading roadmap data:", error);
      }
    };

    fetchData();
  }, [jsonPath, setNodes, setEdges]);

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

      {/* Control Panel - Desktop (Horizontal) */}
      <Panel
        position="top-center"
        className="hidden md:flex space-x-4 p-2 bg-white rounded shadow"
      >
        <button
          onClick={resetGraph}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          aria-label="Reset View"
        >
          Reset View
        </button>
        <button
          onClick={toggleDragging}
          className={`px-4 py-2 rounded transition ${
            isDraggable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isDraggable ? "Disable dragging" : "Enable dragging"}
        >
          {isDraggable ? "Dragging On" : "Dragging Off"}
        </button>
        <button
          onClick={togglePanning}
          className={`px-4 py-2 rounded transition ${
            isPannable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isPannable ? "Disable panning" : "Enable panning"}
        >
          {isPannable ? "Panning On" : "Panning Off"}
        </button>
        <button
          onClick={toggleZooming}
          className={`px-4 py-2 rounded transition ${
            isZoomable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isZoomable ? "Disable zooming" : "Enable zooming"}
        >
          {isZoomable ? "Zooming On" : "Zooming Off"}
        </button>
      </Panel>

      {/* Control Panel - Mobile (Vertical) */}
      <Panel
        position="top-right"
        className="md:hidden flex flex-col space-y-2 p-2 bg-white rounded shadow-md"
      >
        <button
          onClick={resetGraph}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          aria-label="Reset View"
        >
          Reset View
        </button>
        <button
          onClick={toggleDragging}
          className={`px-3 py-1 rounded transition text-sm ${
            isDraggable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isDraggable ? "Disable dragging" : "Enable dragging"}
        >
          {isDraggable ? "Drag: On" : "Drag: Off"}
        </button>
        <button
          onClick={togglePanning}
          className={`px-3 py-1 rounded transition text-sm ${
            isPannable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isPannable ? "Disable panning" : "Enable panning"}
        >
          {isPannable ? "Pan: On" : "Pan: Off"}
        </button>
        <button
          onClick={toggleZooming}
          className={`px-3 py-1 rounded transition text-sm ${
            isZoomable ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          aria-label={isZoomable ? "Disable zooming" : "Enable zooming"}
        >
          {isZoomable ? "Zoom: On" : "Zoom: Off"}
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default FlowChart;
